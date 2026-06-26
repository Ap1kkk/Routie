import React, { useEffect, useRef, useState, useCallback } from 'react';
import mmrgl from 'mmr-gl';
import { decodePolyline } from './map';
import { useTheme } from '../../hooks/useTheme';
import { createRoot } from 'react-dom/client';
import { Marker } from './Marker/Marker';
import { Checkpoint, FullRoute } from '../../types/Route';
import { LandmarkPopup } from './LandmarkPopup/LandmarkPopup';
import { RouteSessionPanel } from './RouteSessionPanel/RouteSessionPanel';
import { sessionsApi } from '../../utils/api/SessionApi';
import type { Session, FinishSessionRequest } from '../../types/Sessions';

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
	const markersRef = useRef<mmrgl.Marker[]>([]);
	const userMarkerRef = useRef<mmrgl.Marker | null>(null);
	const controlsContainerRef = useRef<HTMLDivElement | null>(null);
	const controlsButtonRef = useRef<HTMLDivElement | null>(null);
	const watchIdRef = useRef<number | null>(null);
	const reachingRef = useRef(false);

	const lastPositionRef = useRef<{
		lat: number;
		lon: number;
	} | null>(null);

	const [routeType, setRouteType] = useState<RouteType>('pedestrian');
	const [activeCheckpointIndex, setActiveCheckpointIndex] = useState(0);
	const [session, setSession] = useState<Session | null>(null);
	const [distance, setDistance] = useState(0);

	const CHECKPOINT_RADIUS = 50;

	const completed = Math.min(
		activeCheckpointIndex,
		routeData?.checkpoints.length ?? 0
	);

	const progress = routeData?.checkpoints?.length
		? Math.round((completed / routeData.checkpoints.length) * 100)
		: 0;

	const updateUserPosition = (lat: number, lon: number) => {
		if (!mapRef.current) return;

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

	const checkDistance = useCallback(
		(lat: number, lon: number, speed: number) => {
			updateUserPosition(lat, lon);

			if (!session) return;

			const checkpoint = routeData?.checkpoints?.[activeCheckpointIndex];
			if (!checkpoint) return;

			const dist = calculateDistance(
				lat,
				lon,
				checkpoint.latitude,
				checkpoint.longitude
			);

			if (dist < CHECKPOINT_RADIUS) {
				handleCheckpointReached(checkpoint, speed);
			}
		},
		[session, routeData, activeCheckpointIndex]
	);

	const handleCheckpointReached = async (
		checkpoint: Checkpoint,
		speed: number
	) => {
		if (reachingRef.current || !session) return;

		reachingRef.current = true;

		try {
			const response = await sessionsApi.reachCheckpoint({
				sessionId: session.id,
				checkpointId: checkpoint.id,
				avgSpeedKmh: Math.max(0, speed),
			});

			if (response.success) {
				setActiveCheckpointIndex((prev) => prev + 1);
			}
		} finally {
			reachingRef.current = false;
		}
	};

	const handleStartSession = async () => {
		if (!routeData?.id) return;

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
				startUserLocationTracking();
			},
			() => {
				startUserLocationTracking();
			},
			{
				enableHighAccuracy: true,
				timeout: 90000,
				maximumAge: 5000,
			}
		);
	};

	const handleFinishSession = async () => {
		if (!session) return;

		const request: FinishSessionRequest = {
			sessionId: session.id,
			status: 'FINISHED',
			totalDistanceMeters: Math.round(distance),
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
		if (watchIdRef.current !== null) return;

		watchIdRef.current = navigator.geolocation.watchPosition(
			(position) => {
				const { latitude, longitude, speed } = position.coords;
				if (lastPositionRef.current) {
					const d = calculateDistance(
						lastPositionRef.current.lat,
						lastPositionRef.current.lon,
						latitude,
						longitude
					);
					setDistance((prev) => prev + d);
				}
				lastPositionRef.current = { lat: latitude, lon: longitude };
				checkDistance(latitude, longitude, (speed ?? 0) * 3.6);
			},
			(error) => {
				console.error('Ошибка геолокации:', error);

				switch (error.code) {
					case error.PERMISSION_DENIED:
						console.log('Пользователь запретил доступ');
						break;

					case error.POSITION_UNAVAILABLE:
						console.log('Координаты недоступны');
						break;

					case error.TIMEOUT:
						console.log('Истекло время ожидания');
						break;

					default:
						console.log('Неизвестная ошибка');
				}
			},
			{
				enableHighAccuracy: false,
				maximumAge: 5000,
				timeout: 8000,
			}
		);
	};

	const stopUserLocationTracking = () => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
		}
		if (userMarkerRef.current) {
			userMarkerRef.current.remove();
			userMarkerRef.current = null;
		}
	};

	const addMarkers = (
		map: mmrgl.Map,
		checkpoints: Checkpoint[],
		activeIdx: number
	) => {
		markersRef.current.forEach((m) => m.remove());
		markersRef.current = [];

		checkpoints.forEach((point, index) => {
			const el = document.createElement('div');
			const root = createRoot(el);

			let type: MarkerType = 'default';

			if (index < activeIdx) {
				type = 'completed';
			} else if (index === activeIdx) {
				type = 'active';
			}

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

			markersRef.current.push(marker);
		});
	};

	const updateControls = () => {
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
		if (!userMarkerRef.current) return;

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

			const totalDistance = data.trips[0].summary?.length || 0;
			const totalTime = data.trips[0].summary?.time || 0;
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

		const mapStyle = isLight
			? 'mmr://api/styles/main_style.json'
			: 'mmr://api/styles/dark_style.json';

		const map = new mmrgl.Map({
			container: 'map',
			zoom: 12,
			center: [43.990696, 56.313476],
			style: mapStyle,
		});

		mapRef.current = map;

		map.on('load', () => {
			if (routeData?.checkpoints?.length) {
				addMarkers(map, routeData.checkpoints, activeCheckpointIndex);

				setTimeout(() => {
					buildRoute(map, routeData.checkpoints, routeType);
				}, 100);

				const bounds = new mmrgl.LngLatBounds();
				routeData.checkpoints.forEach((p) =>
					bounds.extend([p.longitude, p.latitude])
				);
				map.fitBounds(bounds, { padding: 50 });
			}

			startUserLocationTracking();
			addControls(map);
		});

		return () => {
			stopUserLocationTracking();
			if (mapRef.current) {
				try {
					clearRoute(mapRef.current);
				} catch (e) {}
				markersRef.current.forEach((m) => m.remove());
				if (userMarkerRef.current) userMarkerRef.current.remove();
				mapRef.current.remove();
			}
		};
	}, [routeData, isLight]);

	useEffect(() => {
		if (!mapRef.current || !routeData) return;

		addMarkers(
			mapRef.current,
			routeData.checkpoints,
			activeCheckpointIndex
		);
	}, [activeCheckpointIndex]);

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
