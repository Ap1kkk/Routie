import React, { useCallback, useEffect, useRef, useState } from 'react';
import mmrgl from 'mmr-gl';
import { decodePolyline } from './map';
import { useTheme } from '../../hooks/useTheme';
import { createRoot } from 'react-dom/client';
import { Marker } from './Marker/Marker';
import { Checkpoint, FullRoute } from '../../types/Route';
import { LandmarkPopup } from './LandmarkPopup/LandmarkPopup';
import { RouteSessionPanel } from './RouteSessionPanel/RouteSessionPanel';
import { sessionsApi } from '../../utils/api/SessionApi';
import type { FinishSessionRequest, Session } from '../../types/Sessions';

import 'mmr-gl/dist/mmr-gl.css';
import styles from './MapComponent.module.scss';

interface RouteOnMapProps {
	routeData?: FullRoute;
}

type MarkerType = 'default' | 'active' | 'completed';

function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number {
	console.log('[calculateDistance] Вызов с координатами:', {
		lat1,
		lon1,
		lat2,
		lon2,
	});
	const R = 6371000;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) ** 2;

	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type RouteType = 'pedestrian' | 'bicycle' | 'auto';

const API_MAP_KEY =
	'a47f57ddcdac37e56aa29e0001678c6f87e2ecbe91e52cc129eecbb01fd0d386';

export const MapComponent = ({ routeData }: RouteOnMapProps = {}) => {
	const { isLight } = useTheme();
	const mapRef = useRef<mmrgl.Map | null>(null);
	const userMarkerRef = useRef<mmrgl.Marker | null>(null);
	const controlsContainerRef = useRef<HTMLDivElement | null>(null);
	const controlsButtonRef = useRef<HTMLDivElement | null>(null);
	const watchIdRef = useRef<number | null>(null);
	const reachingRef = useRef(false);
	const reachedCheckpointIds = useRef<Set<string>>(new Set());
	const checkDistanceRef = useRef<(lat: number, lon: number, speed: number) => void>(() => {});

	const [routeType, setRouteType] = useState<RouteType>('pedestrian');
	const [activeCheckpointIndex, setActiveCheckpointIndex] = useState(0);
	const [session, setSession] = useState<Session | null>(null);
	const distanceRef = useRef(0);
	const timeRef = useRef(0);
	const startTimeRef = useRef<number>(0);

	const sessionRef = useRef<Session | null>(null);
	const routeRef = useRef<FullRoute | null>(null);
	const activeIdxRef = useRef(0);

	useEffect(() => {
		sessionRef.current = session;
	}, [session]);

	useEffect(() => {
		routeRef.current = routeData ?? null;
	}, [routeData]);

	useEffect(() => {
		activeIdxRef.current = activeCheckpointIndex;
	}, [activeCheckpointIndex]);

	const CHECKPOINT_RADIUS = 100;

	const completed = Math.min(
		activeCheckpointIndex,
		routeData?.checkpoints.length ?? 0
	);

	const progress = routeData?.checkpoints?.length
		? Math.round((completed / routeData.checkpoints.length) * 100)
		: 0;

	const updateUserPosition = (lat: number, lon: number) => {
		if (!mapRef.current) {
			return;
		}

		if (!userMarkerRef.current) {
			const el = document.createElement('div');
			el.className = styles.userLocationMarker;

			userMarkerRef.current = new mmrgl.Marker({
				element: el,
				anchor: 'center',
			})
				.setLngLat([lon, lat])
				.addTo(mapRef.current);
		} else {
			userMarkerRef.current.setLngLat([lon, lat]);
		}
	};

	const checkDistance = useCallback((lat: number, lon: number, speed: number) => {
		updateUserPosition(lat, lon);

		const session = sessionRef.current;
		const route = routeRef.current;
		const idx = activeIdxRef.current;

		if (!session) return;

		const checkpoint = route?.checkpoints?.[idx];
		if (!checkpoint) return;

		const distance = calculateDistance(
			lat,
			lon,
			checkpoint.latitude,
			checkpoint.longitude
		);

		if (
			distance <= CHECKPOINT_RADIUS &&
			!reachedCheckpointIds.current.has(checkpoint.id)
		) {
			handleCheckpointReached(checkpoint, speed);
		}
	}, []);

	const handleCheckpointReached = async (checkpoint: Checkpoint, speed: number) => {
		const session = sessionRef.current;

		if (reachingRef.current || !session) {
			return;
		}

		reachingRef.current = true;

		try {
			const response = await sessionsApi.reachCheckpoint({
				sessionId: session.id,
				checkpointId: checkpoint.id,
				avgSpeedKmh: distanceRef.current / (timeRef.current / 60)
			});

			if (response.success) {
				reachedCheckpointIds.current.add(checkpoint.id);
				setActiveCheckpointIndex((prev) => prev + 1);
			}
		} finally {
			reachingRef.current = false;
		}
	};

	const handleStartSession = async () => {
		if (!routeData?.id) {
			return;
		}

		startTimeRef.current = Date.now();

		const response = await sessionsApi.start({
			routeId: routeData.id,
		});

		if (!response.success || !response.data) return;

		setSession(response.data);
		setActiveCheckpointIndex(0);

		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				updateUserPosition(coords.latitude, coords.longitude);
				checkDistance(
					coords.latitude,
					coords.longitude,
					(coords.speed ?? 0) * 3.6
				);
			},
			(error) => {
				if (error.code === 2) {
					console.warn('[watchPosition] POSITION_UNAVAILABLE — пропуск тик');
					return;
				}

				console.error('[watchPosition] Ошибка геолокации:', error);
			},
			{
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0,
			}
		);
	};

	const handleFinishSession = async () => {
		if (!session) {
			return;
		}

		const request: FinishSessionRequest = {
			sessionId: session.id,
			status: 'FINISHED',
			totalDistanceMeters: distanceRef.current * 1000,
		};

		const response = await sessionsApi.finish(request);

		if (response.success && response.data) {
			setSession(response.data);
			stopUserLocationTracking();
		}
	};

	useEffect(() => {
		if (
			session &&
			routeData &&
			activeCheckpointIndex >= (routeData.checkpoints?.length || 0)
		) {
			handleFinishSession();
		}
	}, [activeCheckpointIndex, session, routeData]);

	const startUserLocationTracking = () => {
		if (watchIdRef.current !== null) {
			return;
		}

		watchIdRef.current = navigator.geolocation.watchPosition(
			(position) => {
				const { latitude, longitude, speed } = position.coords;

				checkDistanceRef.current(
					latitude,
					longitude,
					(speed ?? 0) * 3.6
				);
			},
			(error) => {
				console.error('[watchPosition] Ошибка геолокации:', error);
			},
			{
				enableHighAccuracy: true,
				maximumAge: 0,
				timeout: 5000,
			}
		);
	};

	useEffect(() => {
		checkDistanceRef.current = checkDistance;
	}, [checkDistance]);

	const stopUserLocationTracking = () => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
		}
	};

	useEffect(() => {
		if (!session) return;
		startUserLocationTracking();
	}, [session]);

	const markersDataRef = useRef<
		Array<{
			marker: mmrgl.Marker;
			root: ReturnType<typeof createRoot>;
			popupRoot: ReturnType<typeof createRoot>;
		}>
	>([]);

	const addMarkers = useCallback(
		(map: mmrgl.Map, checkpoints: Checkpoint[]) => {
			if (markersDataRef.current.length > 0) {
				return;
			}

			markersDataRef.current = [];

			checkpoints.forEach((point, idx) => {
				const el = document.createElement('div');
				const root = createRoot(el);

				const type: MarkerType =
					idx < activeCheckpointIndex
						? 'completed'
						: idx === activeCheckpointIndex
						? 'active'
						: 'default';

				root.render(<Marker type={type} />);

				const popupContainer = document.createElement('div');
				const popupRoot = createRoot(popupContainer);
				popupRoot.render(<LandmarkPopup landmark={point.landmark} />);

				const popup = new mmrgl.Popup({ offset: 1 }).setDOMContent(
					popupContainer
				);

				const marker = new mmrgl.Marker({ element: el })
					.setLngLat([point.longitude, point.latitude])
					.setPopup(popup)
					.addTo(map);

				markersDataRef.current.push({ marker, root, popupRoot });
			});
		},
		[]
	);

	const updateMarkerTypes = useCallback((activeIdx: number) => {
		console.log(
			'[updateMarkerTypes] Обновление типов маркеров. Активный:',
			activeIdx
		);
		markersDataRef.current.forEach(({ root }, idx) => {
			const type: MarkerType =
				idx < activeIdx
					? 'completed'
					: idx === activeIdx
					? 'active'
					: 'default';

			root.render(<Marker type={type} />);
		});
	}, []);

	useEffect(() => {
		console.log('[useEffect] routeData изменился → добавляем маркеры');
		const map = mapRef.current;
		if (map && routeData?.checkpoints?.length) {
			addMarkers(map, routeData.checkpoints);
		}
	}, [routeData, addMarkers]);

	useEffect(() => {
		console.log('[useEffect] activeCheckpointIndex изменился');
		updateMarkerTypes(activeCheckpointIndex);
	}, [activeCheckpointIndex]);

	const updateControls = () => {
		console.log(
			'[updateControls] Обновление активной кнопки маршрута:',
			routeType
		);
		if (!controlsContainerRef.current) return;

		const selector = controlsContainerRef.current.querySelectorAll(
			`.${styles.controlsButtons}`
		);
		selector.forEach((button) => {
			const buttonElement = button as HTMLButtonElement;
			const buttonType = buttonElement.getAttribute('data-type');
			if (buttonType === routeType) {
				buttonElement.classList.add(styles.active);
			} else {
				buttonElement.classList.remove(styles.active);
			}
		});
	};

	const focusOnUser = () => {
		console.log('[focusOnUser] Фокус на пользователя');
		if (!userMarkerRef.current) {
			console.log('[focusOnUser] Маркер пользователя отсутствует');
			return;
		}

		const lngLat = userMarkerRef.current.getLngLat();

		mapRef.current?.flyTo({
			center: [lngLat.lng, lngLat.lat],
			zoom: 16,
			duration: 700,
		});
	};

	const addControls = (map: mmrgl.Map) => {
		controlsContainerRef.current?.remove();
		controlsButtonRef.current?.remove();

		const geolocateButton = document.createElement('button');
		geolocateButton.className = `${styles.controlsButtons} ${styles.controleButtonUser}`;
		geolocateButton.innerHTML = '📍';
		geolocateButton.title = 'Мое местоположение';
		geolocateButton.onclick = focusOnUser;

		const zoomToRouteButton = document.createElement('button');
		zoomToRouteButton.className = `${styles.controlsButtons} ${styles.controleButtonRoute}`;
		zoomToRouteButton.innerHTML = '🗺️';
		zoomToRouteButton.title = 'Показать весь маршрут';
		zoomToRouteButton.onclick = fitBoundsToRoute;

		const routeButtonsContainer = document.createElement('div');
		routeButtonsContainer.className = styles.routeButtonsContainer;

		const routeTypes: { type: RouteType; label: string; icon: string }[] = [
			{ type: 'pedestrian', label: 'Пешком', icon: '🚶' },
			{ type: 'bicycle', label: 'Велосипед', icon: '🚲' },
			{ type: 'auto', label: 'Авто', icon: '🚗' },
		];

		routeTypes.forEach(({ type, label, icon }) => {
			const button = document.createElement('button');
			button.className = `${styles.controlsButtons} ${
				styles.controlsButtonsMove
			} ${routeType === type ? styles.active : ''}`;
			button.innerHTML = `${icon} ${label}`;
			button.setAttribute('data-type', type);
			button.onclick = () => setRouteType(type);
			routeButtonsContainer.appendChild(button);
		});

		const controlsContainer = document.createElement('div');
		controlsContainer.className = styles.controlsContainer;
		controlsContainer.appendChild(routeButtonsContainer);

		const controlsButton = document.createElement('div');
		controlsButton.className = styles.controlsButtonContainer;
		controlsButton.appendChild(geolocateButton);
		controlsButton.appendChild(zoomToRouteButton);

		controlsContainerRef.current = controlsContainer;
		map.getContainer().appendChild(controlsContainer);

		controlsButtonRef.current = controlsButton;
		map.getContainer().appendChild(controlsButton);
	};

	const getRouteCosting = (type: RouteType): string => {
		switch (type) {
			case 'pedestrian':
				return 'pedestrian';
			case 'bicycle':
				return 'bicycle';
			case 'auto':
				return 'auto';
			default:
				return 'pedestrian';
		}
	};

	const clearRoute = (map: mmrgl.Map) => {
		try {
			if (map.getLayer('route-outline')) {
				map.removeLayer('route-outline');
			}
			if (map.getLayer('route')) {
				map.removeLayer('route');
			}
			if (map.getSource('route')) {
				map.removeSource('route');
			}
		} catch (error) {
			console.warn('Ошибка при очистке маршрута:', error);
		}
	};

	const fitBoundsToRoute = () => {
		if (!mapRef.current || !routeData?.checkpoints?.length) return;

		const bounds = new mmrgl.LngLatBounds();
		routeData.checkpoints.forEach((p) =>
			bounds.extend([p.longitude, p.latitude])
		);
		mapRef.current.fitBounds(bounds, { padding: 50, duration: 1000 });
	};

	const buildRoute = async (
		map: mmrgl.Map,
		checkpoints: any[],
		type: RouteType
	) => {
		const locations = checkpoints.map((p) => ({
			lat: p.latitude,
			lon: p.longitude,
		}));

		const requestBody = {
			locations,
			costing: getRouteCosting(type),
			units: 'kilometers',
			language: 'ru-RU',
		};

		try {
			const response = await fetch(
				`https://maps.vk.com/api/directions?api_key=${API_MAP_KEY}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(requestBody),
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`Ошибка API (${response.status})`, errorText);
				return;
			}

			const data = await response.json();

			if (data.error?.code === 2200) {
				if (type === 'bicycle') {
					await buildRoute(map, checkpoints, 'pedestrian');
					return;
				}

				console.error(data.error.message);
				return;
			}

			if (!data?.trips?.length) {
				return;
			}

			let allPoints: [number, number][] = [];

			data.trips[0].trip.legs.forEach((leg: any) => {
				if (leg.shape) {
					const points = decodePolyline(leg.shape);

					const correctedPoints = points.map(
						(point) =>
							[point[0] / 10, point[1] / 10] as [number, number]
					);

					allPoints.push(...correctedPoints);
				}
			});

			if (!allPoints.length) {
				console.error('Пустой маршрут', data);
				return;
			}

			clearRoute(map);

			map.addSource('route', {
				type: 'geojson',
				data: {
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: allPoints,
					},
				},
			});

			const routeColor =
				type === 'pedestrian'
					? '#13BBFA'
					: type === 'bicycle'
					? '#4CAF50'
					: '#FF9800';
			const routeOutlineColor =
				type === 'pedestrian'
					? '#0D8BB8'
					: type === 'bicycle'
					? '#3D8E40'
					: '#E68A00';
			const routeStyleLine = type === 'pedestrian' ? [2, 2] : [];

			map.addLayer({
				id: 'route-outline',
				type: 'line',
				source: 'route',
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					'line-color': routeOutlineColor,
					'line-width': [
						'interpolate',
						['exponential', 1.5],
						['zoom'],
						5,
						6,
						18,
						12,
					],
					'line-opacity': 0.8,
				},
			});

			map.addLayer({
				id: 'route',
				type: 'line',
				source: 'route',
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					'line-color': routeColor,
					'line-width': [
						'interpolate',
						['exponential', 1.5],
						['zoom'],
						5,
						3,
						18,
						8,
					],
					'line-opacity': 1,
					'line-dasharray': routeStyleLine,
				},
			});

			const totalDistance = data.trips[0].trip.summary.length;
			const totalTime = data.trips[0].trip.summary.time;
			distanceRef.current = totalDistance;
			timeRef.current = Math.round(totalTime / 60);
			console.log(
				`${type} маршрут: ${totalDistance} км, ~${Math.round(
					totalTime / 60
				)} мин`
			);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		mmrgl.accessToken = API_MAP_KEY;
		mmrgl.workerCount = 3;

		const map = new mmrgl.Map({
			container: 'map',
			zoom: 12,
			center: [43.990696, 56.313476],
			style: isLight
				? 'mmr://api/styles/main_style.json'
				: 'mmr://api/styles/dark_style.json',
		});

		mapRef.current = map;

		const handleLoad = () => {
			if (routeData?.checkpoints?.length) {
				addMarkers(map, routeData.checkpoints);
				buildRoute(map, routeData.checkpoints, routeType);
				fitBoundsToRoute();
			}
			addControls(map);
		};

		map.on('load', handleLoad);

		map.on('style.load', () => {
			if (routeData?.checkpoints) {
				buildRoute(map, routeData.checkpoints, routeType);
			}
		});

		return () => {
			map.off('load', handleLoad);
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (
			mapRef.current &&
			routeData?.checkpoints &&
			mapRef.current.loaded()
		) {
			buildRoute(mapRef.current, routeData.checkpoints, routeType);
			updateControls();
		}
	}, [routeType]);

	return (
		<>
			<div id='map' className={styles.mapContainer} />
			<RouteSessionPanel
				current={activeCheckpointIndex}
				total={routeData?.checkpoints?.length || 0}
				progress={progress}
				isStarted={!!session}
				isFinished={session?.status === 'FINISHED'}
				onStart={handleStartSession}
				onFinish={handleFinishSession}
			/>
		</>
	);
};
