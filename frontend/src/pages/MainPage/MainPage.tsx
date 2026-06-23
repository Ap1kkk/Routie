import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';

import {
	fetchDailyRoute,
	fetchRecommendedRoutes,
	fetchPopularRoutes,
} from '../../services/slices/routeSlice/routeSlice';

import { downloadFile } from '../../services/slices/fileSlice/fileSlice';
import { Blur, Button, Slider } from '@ui';
import { RouteCard, RouteOfTheDay } from '@components';

import { useDeviceType } from '../../hooks/useDeviceType';
import lightImage from '../../assets/images/main-page.png';
import blackImage from '../../assets/images/main-black.png';
import { ReactComponent as RightIcon } from '../../assets/icons/chevron-right.svg';
import { Route } from '../../types/Route';

import styles from './MainPage.module.scss';

export const MainPage: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';

	const {
		dailyRoute,
		recommendedRoutes: paginatedRecommended,
		popularRoutes, // ← массив
		isLoading,
		error,
	} = useSelector((state) => state.routes);

	const recommendedList = paginatedRecommended?.content || [];
	const popularList = popularRoutes || []; // ← массив напрямую

	const [likedRoutes, setLikedRoutes] = useState<Record<string, boolean>>({});
	const [routeImages, setRouteImages] = useState<Record<string, string>>({});

	const [theme] = useState<boolean>(
		() => localStorage.getItem('theme') === 'light'
	);

	useEffect(() => {
		dispatch(fetchDailyRoute());
		dispatch(fetchRecommendedRoutes({ page: 0, size: 8 }));
		dispatch(fetchPopularRoutes({ limit: 6 }));
	}, [dispatch]);

	useEffect(() => {
		const loadImages = async () => {
			const imageMap: Record<string, string> = { ...routeImages };

			for (const route of recommendedList) {
				if (route.images?.length > 0 && !imageMap[route.id]) {
					const fileId = route.images[0].id;
					try {
						const imageUrl = await dispatch(
							downloadFile(fileId)
						).unwrap();
						imageMap[route.id] = imageUrl;
					} catch (err) {
						console.error(
							`Не удалось загрузить фото для ${route.id}`,
							err
						);
					}
				}
			}
			setRouteImages(imageMap);
		};

		if (recommendedList.length > 0) loadImages();

		return () => {
			Object.values(routeImages).forEach((url) =>
				URL.revokeObjectURL(url)
			);
		};
	}, [recommendedList, dispatch]);

	const handleToggleLike = (routeId: string) => {
		setLikedRoutes((prev) => ({ ...prev, [routeId]: !prev[routeId] }));
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
						{isLoading && <div>Загрузка маршрута дня...</div>}
						{error && <div>Ошибка: {error}</div>}

						{dailyRoute && !isLoading && (
							<RouteOfTheDay
								route={dailyRoute}
								onNavigate={() =>
									navigate(`/map/${dailyRoute.id}`)
								}
							/>
						)}
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
											? '/recommended'
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
