import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../hooks/useDeviceType';

import { Blur, Button, Slider } from '@ui';
import { RouteCard, RouteOfTheDay } from '@components';

import {
	toggleFavoriteApi,
	getFavoritesApi,
	removeFromFavoritesApi,
	getDailyRouteApi,
	getRecommendedRoutesApi,
	getPopularRoutesApi,
} from '../../utils/api/RoutesApi';

import { downloadFileApi } from '../../utils/api/FileApi';

import { PaginatedRoutes, Route } from '../../types/Route';

import lightImage from '../../assets/images/main-page.png';
import blackImage from '../../assets/images/main-black.png';
import { ReactComponent as RightIcon } from '../../assets/icons/chevron-right.svg';

import styles from './MainPage.module.scss';

export const MainPage: React.FC = () => {
	const navigate = useNavigate();
	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';

	const [dailyRoute, setDailyRoute] = useState<Route | null>(null);
	const [recommendedRoutes, setRecommendedRoutes] = useState<PaginatedRoutes | null>(null);
	const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);
	const [routeImages, setRouteImages] = useState<Record<string, string>>({});
	const [likedRoutes, setLikedRoutes] = useState<Record<string, boolean>>({});
	const [loading, setLoading] = useState(true);

	// Загрузка данных
	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);

				const [dailyRes, recommendedRes, popularRes] = await Promise.all([
					getDailyRouteApi(),
					getRecommendedRoutesApi({ page: 0, size: 8 }),
					getPopularRoutesApi({ limit: 6 }),
				]);

				if (dailyRes.success && dailyRes.data) {
					setDailyRoute(dailyRes.data);
				}

				if (recommendedRes.success && recommendedRes.data) {
					setRecommendedRoutes(recommendedRes.data);
				}

				if (popularRes.success && popularRes.data) {
					setPopularRoutes(popularRes.data);
				}

				// Загрузка избранного
				const favRes = await getFavoritesApi({ page: 0, size: 100 });
				if (favRes.success && favRes.data?.content) {
					const initialLiked: Record<string, boolean> = {};
					favRes.data.content.forEach(route => {
						initialLiked[route.id] = true;
					});
					setLikedRoutes(initialLiked);
				}

				// Загрузка изображений
				const allRoutes = [
					...(recommendedRes.data?.content || []),
					...(popularRes.data || []),
				];

				const imagesMap: Record<string, string> = {};

				await Promise.all(
					allRoutes.map(async (route) => {
						if (!route.images?.length) return;

						try {
							const imgRes = await downloadFileApi(route.images[0].id);
							if (imgRes.success && imgRes.data) {
								imagesMap[route.id] = imgRes.data;
							}
						} catch (err) {
							console.error(`Ошибка загрузки изображения ${route.id}`, err);
						}
					})
				);

				setRouteImages(imagesMap);
			} catch (err) {
				console.error('Ошибка загрузки данных главной страницы:', err);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const handleToggleLike = async (routeId: string) => {
		const isCurrentlyLiked = likedRoutes[routeId] || false;

		setLikedRoutes((prev) => ({
			...prev,
			[routeId]: !isCurrentlyLiked,
		}));

		try {
			if (isCurrentlyLiked) {
				const response = await removeFromFavoritesApi(routeId);
				if (!response.success) {
					setLikedRoutes((prev) => ({ ...prev, [routeId]: true }));
				}
			} else {
				const response = await toggleFavoriteApi(routeId);
				if (!response.success) {
					setLikedRoutes((prev) => ({ ...prev, [routeId]: false }));
				}
			}
		} catch (error) {
			setLikedRoutes((prev) => ({ ...prev, [routeId]: isCurrentlyLiked }));
			console.error('Ошибка изменения избранного:', error);
		}
	};

	const handleCardClick = (routeId: string) => {
		navigate(`/map/${routeId}`);
	};

	const recommendedList = recommendedRoutes?.content ?? [];
	const popularList = popularRoutes || [];

	return (
		<div>
			<img
				src={localStorage.getItem('theme') === 'light' ? lightImage : blackImage}
				alt='Фон'
				className={styles.backgroundImage}
			/>

			<section className={styles.mainPageContainer}>
				{dailyRoute && (
					<div className={styles.containerRouteOfTheDay}>
						<div className={styles.routeContainer}>
							<RouteOfTheDay
								route={dailyRoute}
								onNavigate={() => navigate(`/map/${dailyRoute.id}`)}
							/>
						</div>
					</div>
				)}

				{popularList.length > 0 && (
					<article className={styles.sectionPopRecRoutes}>
						<div className={styles.headerOfSmallSection}>
							<Blur className={styles.containerBlur}>
                         <span className={styles.titlePopularRoutes}>
                            Популярное
                         </span>
							</Blur>
							<Button
								variant='blur'
								onClick={() => navigate(isMobile ? '/popular-mobile' : '/popular')}
								iconRight={<RightIcon />}
								children='Смотреть все'
								className={styles.buttonWatchAll}
							/>
						</div>

						<Slider
							cards={popularList.map((route) => (
								<RouteCard
									key={route.id}
									route={route}
									imageUrl={routeImages[route.id] || '/placeholder-route.jpg'}
									isLiked={likedRoutes[route.id] || false}
									onToggleLike={handleToggleLike}
									variant='compact'
								/>
							))}
							gap={12}
							infinite={true}
							showArrows={true}
							showDots={true}
							onCardClick={(index) => handleCardClick(popularList[index].id)}
						/>
					</article>
				)}

				{recommendedList.length > 0 && (
					<article className={styles.sectionPopRecRoutes}>
						<div className={styles.headerOfSmallSection}>
							<Blur className={styles.containerBlur}>
                         <span className={styles.titlePopularRoutes}>
                            Рекомендованное
                         </span>
							</Blur>
							<Button
								variant='blur'
								onClick={() => navigate(isMobile ? '/recommended-mobile' : '/recommended')}
								iconRight={<RightIcon />}
								children='Смотреть все'
								className={styles.buttonWatchAll}
							/>
						</div>

						<div className={styles.positionGrid}>
							{recommendedList.map((route) => (
								<RouteCard
									key={route.id}
									route={route}
									imageUrl={routeImages[route.id] || '/placeholder-route.jpg'}
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