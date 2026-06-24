import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../hooks/useDeviceType';
import { Blur, Button, Slider } from '@ui';
import {
	toggleFavoriteApi,
	getFavoritesApi,
	removeFromFavoritesApi,
} from '../../utils/api/RoutesApi';
import { RouteCard, RouteOfTheDay } from '@components';
import { PaginatedRoutes, Route } from '../../types/Route';

import lightImage from '../../assets/images/main-page.png';
import blackImage from '../../assets/images/main-black.png';

import { ReactComponent as RightIcon } from '../../assets/icons/chevron-right.svg';

import styles from './MainPage.module.scss';

export const MainPage: React.FC = () => {
	const navigate = useNavigate();
	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';

	const [likedRoutes, setLikedRoutes] = useState<Record<string, boolean>>({});

	const { dailyRoute, recommendedRoutes, popularRoutes, routeImages } =
		useLoaderData() as {
			dailyRoute: Route;
			recommendedRoutes: PaginatedRoutes;
			popularRoutes: Route[];
			routeImages: Record<string, string>;
		};

	const recommendedList = recommendedRoutes?.content ?? [];
	const popularList = popularRoutes || [];

	const [theme] = useState<boolean>(
		() => localStorage.getItem('theme') === 'light'
	);
	
	useEffect(() => {
		const loadFavorites = async () => {
			try {
				const res = await getFavoritesApi({ page: 0, size: 100 });
				if (res.success && res.data?.content) {
					const initialLiked: Record<string, boolean> = {};
					res.data.content.forEach(route => {
						initialLiked[route.id] = true;
					});
					setLikedRoutes(initialLiked);
				}
			} catch (err) {
				console.error('Не удалось загрузить избранное:', err);
			}
		};

		loadFavorites();
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
					setLikedRoutes((prev) => ({
						...prev,
						[routeId]: true,
					}));
				}
			} else {
				const response = await toggleFavoriteApi(routeId);
				if (!response.success) {
					setLikedRoutes((prev) => ({
						...prev,
						[routeId]: false,
					}));
				}
			}
		} catch (error) {
			setLikedRoutes((prev) => ({
				...prev,
				[routeId]: isCurrentlyLiked,
			}));
			console.error('Ошибка изменения избранного:', error);
		}
	};

	const handleCardClick = (routeId: string) => {
		navigate(`/map/${routeId}`);
	};

	return (
		<div>
			<img
				src={theme ? lightImage : blackImage}
				alt='Фон'
				className={styles.backgroundImage}
			/>

			<section className={styles.mainPageContainer}>
				<div className={styles.containerRouteOfTheDay}>
					<div className={styles.routeContainer}>
						<RouteOfTheDay
							route={dailyRoute}
							onNavigate={() => navigate(`/map/${dailyRoute.id}`)}
						/>
					</div>
				</div>

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
								onClick={() =>
									navigate(
										isMobile
											? '/popular-mobile'
											: '/popular'
									)
								}
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
									imageUrl={
										routeImages[route.id] ||
										'/placeholder-route.jpg'
									}
									isLiked={likedRoutes[route.id] || false}
									onToggleLike={handleToggleLike}
									variant='compact'
								/>
							))}
							gap={12}
							infinite={true}
							showArrows={true}
							showDots={true}
							onCardClick={(index) =>
								handleCardClick(popularList[index].id)
							}
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
								onClick={() =>
									navigate(
										isMobile
											? '/recommended-mobile'
											: '/recommended'
									)
								}
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
									imageUrl={
										routeImages[route.id] ||
										'/placeholder-route.jpg'
									}
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