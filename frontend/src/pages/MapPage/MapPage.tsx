import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMockRouteById, mockRouteKremlin } from '../../mocks/route';
import { RouteOnMap } from '@components';
import styles from './MapPage.module.scss';

export const MapPage = () => {
	const { routeId } = useParams();
	const [routeData, setRouteData] = useState<any>(null);
	const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserLocation([position.coords.latitude, position.coords.longitude]);
				},
				(err) => {
					console.log('Ошибка геолокации:', err);
					setUserLocation([56.326, 44.006]);
				},
				{ enableHighAccuracy: true, timeout: 5000 }
			);
		} else {
			setUserLocation([56.326, 44.006]);
		}
	}, []);

	// Загружаем данные маршрута
	useEffect(() => {
		const loadRoute = async () => {
			setIsLoading(true);
			setError(null);

			try {
				await new Promise(resolve => setTimeout(resolve, 500));

				let data;
				if (routeId) {
					data = getMockRouteById(routeId);
				}

				if (!data) {
					data = mockRouteKremlin;
				}

				setRouteData(data);
				console.log('Загружен маршрут:', data.name);
			} catch (err) {
				console.error('Ошибка загрузки:', err);
				setError('Не удалось загрузить маршрут');
				setRouteData(mockRouteKremlin);
			} finally {
				setIsLoading(false);
			}
		};

		loadRoute();
	}, [routeId]);

	if (isLoading) {
		return (
			<section className={styles.container}>
				<div className={styles.loader}>
					<div className={styles.spinner}></div>
					<p>Загрузка маршрута...</p>
				</div>
			</section>
		);
	}

	if (error && !routeData) {
		return (
			<section className={styles.container}>
				<div className={styles.error}>
					<p>{error}</p>
					<button onClick={() => window.location.reload()}>Повторить</button>
				</div>
			</section>
		);
	}

	return (
		<section className={styles.container}>
			<div className={styles.mapWrapper}>
				{routeData && (
					<RouteOnMap
						routeData={routeData}
						userLocation={userLocation}
						showUserMarker={true}
						showRoute={true}
					/>
				)}
			</div>
		</section>
	);
};

export default MapPage;