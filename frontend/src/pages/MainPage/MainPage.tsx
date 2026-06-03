import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../types/route';
import { Blur, Button, Slider } from '@ui';
import { RouteCard, RouteOfTheDay } from '@components';
import {
	mockRoutes,
	getRandomMockRoute,
	getRouteImage,
} from '../../mocks/route';
import { useDeviceType } from '../../hooks/useDeviceType';

import lightImage from '../../assets/images/main-page.png';
import blackImage from '../../assets/images/main-black.png';

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

	const [theme] = useState<boolean>(() => {
		const saved = localStorage.getItem('theme');
		return saved === 'light';
	});

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

	return (
		<div>
			<img
				src={theme ? lightImage : blackImage}
				alt={'Фон'}
				className={styles.backgroundImage}
			/>
			<section className={styles.mainPageContainer}>
				<div className={styles.containerRouteOfTheDay}>
					<div className={styles.routeContainer}>
						{routeOfTheDay && (
							<RouteOfTheDay
								route={routeOfTheDay}
								onNavigate={() =>
									navigate(`/map/${routeOfTheDay.id}`)
								}
							/>
						)}
					</div>
				</div>

				{popularRoutes.length > 0 && (
					<article className={styles.sectionPopRecRoutes}>
						<div className={styles.headerOfSmallSection}>
							<Blur className={styles.containerBlur}>
								<span className={styles.titlePopularRoutes}>
									Популярное
								</span>
							</Blur>
							<Button
								variant='blur'
								onClick={() =>
									navigate(isMobile ? '/routes' : '/filter')
								}
								iconRight={<RightIcon />}
								children={'Смотреть все'}
								className={styles.buttonWatchAll}
							/>
						</div>

						<Slider
							cards={popularCards}
							gap={12}
							infinite={true}
							showArrows={true}
							showDots={true}
							onCardClick={handleCardClick}
						/>
					</article>
				)}

				{recommendedRoutes.length > 0 && (
					<article className={styles.sectionPopRecRoutes}>
						<div className={styles.headerOfSmallSection}>
							<Blur className={styles.containerBlur}>
								<span className={styles.titlePopularRoutes}>
									Рекомендованное
								</span>
							</Blur>
							<Button
								variant='blur'
								onClick={() =>
									navigate(isMobile ? '/routes' : '/filter')
								}
								iconRight={<RightIcon />}
								children={'Смотреть все'}
								className={styles.buttonWatchAll}
							/>
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
					</article>
				)}
			</section>
		</div>
	);
};
