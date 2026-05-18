import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../types/route';
import { Button, Slider } from '@ui';
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

	const popularCards = popularRoutes.map((route) => (
		<RouteCard
			key={route.id}
			route={route}
			imageUrl={getRouteImage(route.id)}
			isLiked={likedRoutes[route.id] || false}
			onToggleLike={handleToggleLike}
			variant='compact'
		/>
	));

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
				setPopularRoutes(mockRoutes.slice(0, 6)); // можно больше
				setRecommendedRoutes(mockRoutes.slice(6, 12));

				setRouteOfTheDay(getRandomMockRoute());
				setLoading(false);
			} catch (err) {
				setError('Ошибка при загрузке маршрутов');
				setLoading(false);
			}
		};

		const timer = setTimeout(loadRoutes, 500);
		return () => clearTimeout(timer);
	}, []);

	const handleToggleLike = (routeId: string) => {
		setLikedRoutes((prev) => ({
			...prev,
			[routeId]: !prev[routeId],
		}));
	};

	const handleCardClick = (index: number) => {
		const route = popularRoutes[index];
		if (route) {
			navigate(`/map/${route.id}`);
		}
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
					onNavigate={() => navigate(`/map/${routeOfTheDay.id}`)}
				/>
			)}

			{popularRoutes.length > 0 && (
				<div className={styles.container}>
					<div className={styles.containerHeader}>
						<h2 className={styles.title}>Популярные маршруты</h2>
					</div>

					<Slider
						cards={popularCards}
						gap={12}
						infinite={true}
						showArrows={true}
						showDots={true}
						onCardClick={handleCardClick}
					/>
				</div>
			)}

			{recommendedRoutes.length > 0 && (
				<div className={styles.container}>
					<div className={styles.containerHeader}>
						<h2 className={styles.title}>
							Рекомендованные маршруты
						</h2>
						<Button
							variant='tertiary'
							onClick={() =>
								navigate(isMobile ? '/routes' : '/filter')
							}
							iconRight={<RightIcon />}
							className={styles.containerHeaderButton}>
							Смотреть все
						</Button>
					</div>

					<div className={styles.positionGrid}>
						{recommendedRoutes.map((route) => (
							<RouteCard
								key={route.id}
								route={route}
								imageUrl={getRouteImage(route.id)}
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
