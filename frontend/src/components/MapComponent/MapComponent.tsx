import React, { useEffect, useRef, useState } from 'react';
import mmrgl from 'mmr-gl';
import { decodePolyline } from './map';
import { useTheme } from '../../hooks/useTheme';
import { createRoot } from 'react-dom/client';

import 'mmr-gl/dist/mmr-gl.css';

import styles from './MapComponent.module.scss';
import { Marker } from './Marker/Marker';

interface RouteOnMapProps {
	routeData?: {
		checkpoints?: Array<{
			id: string;
			latitude: number;
			longitude: number;
			name?: string;
			description?: string;
		}>;
		name?: string;
	};
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
	const [routeType, setRouteType] = useState<RouteType>('pedestrian');

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
				console.error(`Маршрут "${type}" не построен`, data);
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

	const getUserLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;

				if (mapRef.current) {
					if (userMarkerRef.current) {
						userMarkerRef.current.remove();
					}

					const userMarkerElement = document.createElement('div');
					userMarkerElement.innerHTML = `
						<div style="
							width: 20px;
							height: 20px;
							background-color: #13BBFA;
							border: 3px solid white;
							border-radius: 50%;
							box-shadow: 0 0 0 2px #13BBFA;
						"></div>
					`;

					userMarkerRef.current = new mmrgl.Marker({
						element: userMarkerElement,
					})
						.setLngLat([longitude, latitude])
						.addTo(mapRef.current);

					mapRef.current.flyTo({
						center: [longitude, latitude],
						zoom: 15,
						duration: 1000,
					});
				}
			},
			(error) => {
				console.error('Ошибка получения геопозиции:', error);
			}
		);
	};

	const addMarkers = (map: mmrgl.Map, checkpoints: any[]) => {
		markersRef.current.forEach((marker) => marker.remove());
		markersRef.current = [];

		checkpoints.forEach((point, index) => {
			const isFirst = index === 0;
			const isLast = index === checkpoints.length - 1;

			let markerElement: HTMLElement | undefined;

			if (isFirst || isLast) {
				const markerElement = document.createElement('div');

				const root = createRoot(markerElement);

				root.render(<Marker type={isFirst ? 'start' : 'finish'} />);

				const marker = new mmrgl.Marker({
					element: markerElement,
				})
					.setLngLat([point.longitude, point.latitude])
					.addTo(map);

				markersRef.current.push(marker);

				return;
			}

			const marker = new mmrgl.Marker({
				element: markerElement,
				color: !markerElement
					? isFirst
						? '#4CAF50'
						: isLast
						? '#f44336'
						: '#13BBFA'
					: undefined,
			})
				.setLngLat([point.longitude, point.latitude])
				.addTo(map);

			if (point.name) {
				const popup = new mmrgl.Popup({ className: styles.popup })
					.setHTML(`
							<h3>${point.name}</h3>
							<p>${point.description}</p>
						`);
				marker.setPopup(popup);
			}

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

	const addControls = (map: mmrgl.Map) => {
		const geolocateButton = document.createElement('button');
		geolocateButton.className = `${styles.controlsButtons} ${styles.controleButtonUser}`;
		geolocateButton.innerHTML = '📍';
		geolocateButton.title = 'Мое местоположение';
		geolocateButton.onclick = getUserLocation;

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
			button.onclick = () => {
				setRouteType(type);
			};
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
				addMarkers(map, routeData.checkpoints);

				setTimeout(() => {
					if (routeData.checkpoints) {
						buildRoute(map, routeData.checkpoints, routeType);
					}
				}, 100);

				const bounds = new mmrgl.LngLatBounds();
				routeData.checkpoints.forEach((p) =>
					bounds.extend([p.longitude, p.latitude])
				);
				map.fitBounds(bounds, { padding: 50 });
			}

			addControls(map);
		});

		return () => {
			if (mapRef.current) {
				try {
					clearRoute(mapRef.current);
				} catch (e) {}
				markersRef.current.forEach((m) => m.remove());
				if (userMarkerRef.current) {
					userMarkerRef.current.remove();
				}
				mapRef.current.remove();
			}
		};
	}, [routeData, isLight]);

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

	return <div id='map' className={styles.mapContainer} />;
};
