import React, { useEffect, useRef, useState } from 'react';
import { Route } from '../../types/route';

import placeholderIcon from '../../assets/icons/placeholder.svg';
import styles from './RouteOnMap.module.scss';

declare global {
	interface Window {
		ymaps: any;
	}
}

interface RouteOnMapProps {
	routeData: Route;
	userLocation?: [number, number] | null;
	showUserMarker?: boolean;
	showRoute?: boolean;
}

export const RouteOnMap: React.FC<RouteOnMapProps> = ({
	routeData,
	userLocation,
	showUserMarker = true,
	showRoute = true,
}) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const routeRef = useRef<any>(null);
	const markersRef = useRef<any[]>([]);
	const userMarkerRef = useRef<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const isInitialized = useRef(false);
	const dataLoadedRef = useRef(false);

	// Центр карты
	const getMapCenter = (): [number, number] => {
		if (userLocation) return userLocation;
		if (routeData?.checkpoints?.[0]) {
			return [
				routeData.checkpoints[0].latitude,
				routeData.checkpoints[0].longitude,
			];
		}
		return [56.326, 44.006];
	};

	const getIconUrl = (): string => {
		if (typeof placeholderIcon === 'string') {
			return placeholderIcon;
		}
		return '/icons/placeholder.svg';
	};

	const centerOnFirstCheckpoint = () => {
		if (!mapRef.current || !routeData?.checkpoints?.[0]) return;

		mapRef.current.setCenter(
			[
				routeData.checkpoints[0].latitude,
				routeData.checkpoints[0].longitude,
			],
			15,
			{ duration: 300 }
		);
	};

	// Добавление маркеров чекпоинтов
	const addCheckpointMarkers = () => {
		if (!mapRef.current || !window.ymaps || !routeData?.checkpoints) return;

		routeData.checkpoints.forEach((checkpoint, index) => {
			const isStart = index === 0;
			const isEnd = index === routeData.checkpoints.length - 1;

			const iconUrl = getIconUrl();

			const marker = new window.ymaps.Placemark(
				[checkpoint.latitude, checkpoint.longitude],
				{
					hintContent: checkpoint.name || `Точка ${index + 1}`,
					balloonContent: `
						<div style="padding: 10px;">
							<b>${checkpoint.name || `Точка ${index + 1}`}</b>
							${checkpoint.description ? `<p>${checkpoint.description}</p>` : ''}
							${isStart ? '<p>🏁 Начало маршрута</p>' : ''}
							${isEnd ? '<p>🏆 Конец маршрута</p>' : ''}
						</div>
					`,
				},
				{
					iconLayout: 'default#image',
					iconImageHref: iconUrl,
					iconImageSize: [32, 32],
					iconImageOffset: [-16, -32],
				}
			);

			mapRef.current.geoObjects.add(marker);
			markersRef.current.push(marker);
		});

		console.log(`Добавлено ${markersRef.current.length} маркеров`);
	};

	// Построение маршрута
	const buildRoute = () => {
		if (
			!mapRef.current ||
			!window.ymaps ||
			!routeData?.checkpoints ||
			routeData.checkpoints.length < 2
		)
			return;

		try {
			if (routeRef.current) {
				mapRef.current.geoObjects.remove(routeRef.current);
			}

			const points = routeData.checkpoints.map((cp) => [
				cp.latitude,
				cp.longitude,
			]);

			const multiRoute = new window.ymaps.multiRouter.MultiRoute(
				{
					referencePoints: points,
					params: {
						routingMode: 'pedestrian',
						results: 1,
					},
				},
				{
					routeActiveStrokeWidth: 2,
					routeActiveStrokeColor: '#007bff',
				}
			);

			mapRef.current.geoObjects.add(multiRoute);
			routeRef.current = multiRoute;

			multiRoute.events.add('ready', () => {
				try {
					const bounds = multiRoute.getBounds();
					if (bounds) {
						mapRef.current.setBounds(bounds, {
							checkZoomRange: true,
							zoomMargin: 50,
							duration: 300,
						});
					}
				} catch (err) {
					console.error('Ошибка центрирования:', err);
				}
			});

			console.log('Маршрут построен');
		} catch (err) {
			console.error('Ошибка построения маршрута:', err);
		}
	};

	// Добавление маркера пользователя
	const addUserMarker = () => {
		if (!mapRef.current || !window.ymaps || !userLocation) return;

		if (userMarkerRef.current) {
			mapRef.current.geoObjects.remove(userMarkerRef.current);
		}

		userMarkerRef.current = new window.ymaps.Placemark(
			userLocation,
			{
				hintContent: 'Вы здесь',
				balloonContent: 'Ваше текущее местоположение',
			},
			{
				preset: 'islands#blueCircleDotIcon',
			}
		);

		mapRef.current.geoObjects.add(userMarkerRef.current);
	};

	// Инициализация карты (один раз)
	useEffect(() => {
		if (isInitialized.current) return;

		const loadMap = () => {
			if (!window.ymaps) {
				setTimeout(loadMap, 100);
				return;
			}
			window.ymaps.ready(() => {
				if (!mapContainerRef.current || mapRef.current) return;
				try {
					mapRef.current = new window.ymaps.Map(
						mapContainerRef.current,
						{
							center: getMapCenter(),
							zoom: 14,
							controls: ['zoomControl', 'fullscreenControl'],
						}
					);
					setIsLoading(false);
					isInitialized.current = true;
				} catch (err) {
					setError('Не удалось создать карту');
				}
			});
		};

		if (window.ymaps) {
			loadMap();
		} else {
			const script = document.createElement('script');
			script.src =
				'https://api-maps.yandex.ru/2.1/?apikey=71b4ede5-7042-4bba-9243-a2cb4b638bd5&lang=ru_RU';
			script.async = true;
			script.onload = loadMap;
			script.onerror = () => {
				setError('Не удалось загрузить API карт');
				setIsLoading(false);
			};
			document.head.appendChild(script);
		}

		return () => {
			if (mapRef.current) {
				mapRef.current.destroy();
			}
		};
	}, []);

	// Добавляем данные на карту после её инициализации
	useEffect(() => {
		if (!mapRef.current || !window.ymaps || isLoading) return;

		const timer = setTimeout(() => {
			addCheckpointMarkers();

			if (showRoute) {
				buildRoute();
			}

			if (showUserMarker && userLocation) {
				addUserMarker();
			}
		}, 100);

		return () => clearTimeout(timer);
	}, [mapRef.current, window.ymaps, isLoading]);

	// Обновление карты
	useEffect(() => {
		if (!mapRef.current || !window.ymaps || isLoading) return;

		centerOnFirstCheckpoint();
		addCheckpointMarkers();

		if (showRoute) buildRoute();
		if (showUserMarker && userLocation) addUserMarker();
	}, [mapRef.current, window.ymaps, isLoading]);

	if (error) {
		return (
			<div className={styles.mapContainer}>
				<div className={styles.mapError}>
					<p>{error}</p>
					<button onClick={() => window.location.reload()}>
						Обновить
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.mapContainer}>
			<div ref={mapContainerRef} className={styles.map} />
			{isLoading && (
				<div className={styles.mapLoader}>
					<div className={styles.spinner}></div>
					<p>Загрузка карты...</p>
				</div>
			)}
		</div>
	);
};
