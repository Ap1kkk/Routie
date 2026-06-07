import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';

import {
	fetchDailyRoute,
	fetchRecommendedRoutes,
} from '../../services/slices/routeSlice/routeSlice';

import { Blur, Button, Slider } from '@ui';
import { RouteCard, RouteOfTheDay } from '@components';

import { mockRoutes, getRouteImage } from '../../mocks/route';

import { useDeviceType } from '../../hooks/useDeviceType';

import lightImage from '../../assets/images/main-page.png';
import blackImage from '../../assets/images/main-black.png';
import { ReactComponent as RightIcon } from '../../assets/icons/chevron-right.svg';

import styles from './MainPage.module.scss';
import { Route } from '../../types/Route';
import {downloadFile} from "../../services/slices/fileSlice/fileSlice";

export const MainPage: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';

	// Redux — ИСПРАВЛЕНО
	const {
		dailyRoute,
		recommendedRoutes: paginatedRecommended,
		isLoading,
		error,
	} = useSelector((state) => state.routes); // ← routes !

	const recommendedList = paginatedRecommended?.content || [];

	const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);
	const [likedRoutes, setLikedRoutes] = useState<Record<string, boolean>>({});
	const [routeImages, setRouteImages] = useState<Record<string, string>>({});

	const [theme] = useState<boolean>(() => {
		const saved = localStorage.getItem('theme');
		return saved === 'light';
	});

	useEffect(() => {
		const checkAuth = () => {
			try {
				const token = localStorage.getItem('accessToken');
				const refreshToken = localStorage.getItem('refreshToken');
			} catch {}
		};
		checkAuth();
	}, []);

	// Загрузка данных
	useEffect(() => {
		dispatch(fetchDailyRoute());
		dispatch(fetchRecommendedRoutes({ page: 0, size: 8 }));
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
							`Не удалось загрузить фото для маршрута ${route.id}`,
							err
						);
					}
				}
			}

			setRouteImages(imageMap);
		};

		if (recommendedList.length > 0) {
			loadImages();
		}

		return () => {
			// Очистка blob URL при размонтировании
			Object.values(routeImages).forEach((url) =>
				URL.revokeObjectURL(url)
			);
		};
	}, [recommendedList, dispatch]);

	// Моки для популярного
	useEffect(() => {
		setPopularRoutes(mockRoutes.slice(0, 6));
	}, []);

	const handleToggleLike = (routeId: string) => {
		setLikedRoutes((prev) => ({
			...prev,
			[routeId]: !prev[routeId],
		}));
	};

	const handleCardClick = (index: number) => {
		const route = popularRoutes[index];
		if (route) navigate(`/map/${route.id}`);
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
				alt='Фон'
				className={styles.backgroundImage}
			/>

			<section className={styles.mainPageContainer}>
				{/* Маршрут дня */}
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

				{/* Популярное */}
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
								children='Смотреть все'
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

				{/* Рекомендованное */}
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
