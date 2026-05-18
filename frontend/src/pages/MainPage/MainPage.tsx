import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../types/route';
import { Button } from '@ui';
import { RouteCard, RouteOfTheDay } from '@components';
import {
	mockRoutes,
	getRandomMockRoute,
	getRouteImage,
} from '../../mocks/route';
import { useDeviceType } from '../../hooks/useDeviceType';

import { ReactComponent as RightIcon } from '../../assets/icons/chevron-right.svg';

import styles from './MainPage.module.scss';

export const MainPage: React.FC = () => {
	const navigate = useNavigate();
	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';
	const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);
	const [recommendedRoutes, setRecommendedRoutes] = useState<Route[]>([]);
	const [likedRoutes, setLikedRoutes] = useState<Record<string, boolean>>({});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [routeOfTheDay, setRouteOfTheDay] = useState<Route | null>(null);

	useEffect(() => {
		const checkAuth = () => {
			try {
				const token = localStorage.getItem('accessToken');
				const refreshToken = localStorage.getItem('refreshToken');
				setIsAuthenticated(!!(token && refreshToken));
			} catch {
				setIsAuthenticated(false);
			}
		};
		checkAuth();
	}, []);

	useEffect(() => {
		const loadRoutes = () => {
			try {
				setPopularRoutes(mockRoutes.slice(0, 4));
				setRecommendedRoutes(mockRoutes.slice(4, 8));

				const randomRoute = getRandomMockRoute();
				setRouteOfTheDay(randomRoute);

				setLoading(false);
			} catch (err) {
				setError('Ошибка при загрузке маршрутов');
				setLoading(false);
			}
		};

		const timer = setTimeout(loadRoutes, 500);
		return () => clearTimeout(timer);
	}, []);

	const handleRouteOfTheDay = () => {
		if (routeOfTheDay) {
			navigate(`/map/${routeOfTheDay.id}`);
		} else if (popularRoutes.length > 0) {
			navigate(`/map/${popularRoutes[0].id}`);
		} else if (recommendedRoutes.length > 0) {
			navigate(`/map/${recommendedRoutes[0].id}`);
		} else {
			navigate(`/map/${mockRoutes[0].id}`);
		}
	};

	const handleToggleLike = (routeId: string) => {
		setLikedRoutes((prev) => ({
			...prev,
			[routeId]: !prev[routeId],
		}));

		console.log(`Route ${routeId} liked: ${!likedRoutes[routeId]}`);
	};

	if (loading) {
		return (
			<div className={styles.container}>
				<div className={styles.mapBackground} />
				<div className={styles.loading}>
					<div className={styles.spinner}></div>
					<p>Загрузка маршрутов...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.container}>
				<div className={styles.mapBackground} />
				<div className={styles.error}>
					<p>{error}</p>
					<button onClick={() => window.location.reload()}>
						Попробовать снова
					</button>
				</div>
			</div>
		);
	}

	return (
		<section className={styles.section}>
			{routeOfTheDay && (
				<RouteOfTheDay
					route={routeOfTheDay}
					onNavigate={handleRouteOfTheDay}
				/>
			)}

			{popularRoutes.length > 0 && (
				<div className={styles.container}>
					<div className={styles.containerHeader}>
						<h2 className={styles.title}>Популярные маршруты</h2>
					</div>
					<div className={styles.position}>
						{popularRoutes.map((route) => (
							<RouteCard
								key={route.id}
								imageUrl={getRouteImage(route.id)}
								route={route}
								isLiked={likedRoutes[route.id] || false}
								onToggleLike={handleToggleLike}
								variant='compact'
							/>
						))}
					</div>
				</div>
			)}

			{recommendedRoutes.length > 0 && (
				<div className={styles.container}>
					<div className={styles.containerHeader}>
						<h2 className={styles.title}>
							Рекомендованные маршруты
						</h2>
						<div className={styles.button}>
							<Button
								variant='tertiary'
								onClick={() => {
									isMobile
										? navigate('/routes')
										: navigate('/filter');
								}}
								children={'Смотреть все'}
								iconRight={<RightIcon />}
								className={styles.containerHeaderButton}
							/>
						</div>
					</div>
					<div className={styles.positionGrid}>
						{recommendedRoutes.map((route) => (
							<RouteCard
								key={route.id}
								imageUrl={getRouteImage(route.id)}
								route={route}
								isLiked={likedRoutes[route.id] || false}
								onToggleLike={handleToggleLike}
								variant='standard'
							/>
						))}
					</div>
				</div>
			)}
		</section>
	);
};

export default MainPage;
