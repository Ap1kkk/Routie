import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RouteCard } from '@components';
import { Button, Input } from '@ui';

import {
	getFavoritesApi,
	getRecommendedRoutesApi,
	getPopularRoutesApi,
	routeApi,
	toggleFavoriteApi,
	removeFromFavoritesApi,
} from '../../utils/api/RoutesApi';

import { downloadFileApi } from '../../utils/api/FileApi';

import { Route } from '../../types/Route';

import { ReactComponent as Filter } from '../../assets/icons/filter-square.svg';
import { ReactComponent as Search } from '../../assets/icons/search.svg';

import styles from './RoutesMobilePage.module.scss';

export const RoutesMobilePage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [routes, setRoutes] = useState<Route[]>([]);
	const [routeImages, setRouteImages] = useState<Record<string, string>>({});
	const [searchQuery, setSearchQuery] = useState('');
	const [likedRoutes, setLikedRoutes] = useState<Record<string, boolean>>({});
	const [loading, setLoading] = useState(true);
	const [title, setTitle] = useState('Маршруты');
	const [isFavoritesPage, setIsFavoritesPage] = useState(false);

	const pathname = location.pathname;

	// Определяем тип страницы и загружаем данные
	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			setSearchQuery('');

			try {
				let loadedRoutes: Route[] = [];
				let pageTitle = 'Маршруты';
				let isFav = false;

				if (pathname.includes('/favorites')) {
					const res = await getFavoritesApi({ page: 0, size: 20 });
					if (res.success && res.data) {
						loadedRoutes = res.data.content || [];
					}
					pageTitle = 'Избранное';
					isFav = true;
				} else if (pathname.includes('/recommended')) {
					const res = await getRecommendedRoutesApi({ page: 0, size: 20 });
					if (res.success && res.data) {
						loadedRoutes = res.data.content || [];
					}
					pageTitle = 'Рекомендованные';
				} else if (pathname.includes('/popular')) {
					const res = await getPopularRoutesApi({ limit: 20 });
					if (res.success && res.data) {
						loadedRoutes = res.data;
					}
					pageTitle = 'Популярные';
				} else {
					const res = await routeApi.search({ page: 0, size: 20 });
					if (res.success && res.data) {
						loadedRoutes = res.data.content || [];
					}
					pageTitle = 'Маршруты';
				}

				setRoutes(loadedRoutes);
				setTitle(pageTitle);
				setIsFavoritesPage(isFav);

				// Загружаем изображения
				const images: Record<string, string> = {};
				await Promise.all(
					loadedRoutes.map(async (route) => {
						if (!route.images?.length) return;
						try {
							const imgRes = await downloadFileApi(route.images[0].id);
							if (imgRes.success && imgRes.data) {
								images[route.id] = imgRes.data;
							}
						} catch (err) {
							console.error(`Ошибка загрузки изображения ${route.id}`, err);
						}
					})
				);
				setRouteImages(images);

				// Загружаем избранное
				const favRes = await getFavoritesApi({ page: 0, size: 100 });
				if (favRes.success && favRes.data?.content) {
					const favIds = new Set(favRes.data.content.map(r => r.id));
					const initialLiked: Record<string, boolean> = {};
					loadedRoutes.forEach(route => {
						initialLiked[route.id] = favIds.has(route.id);
					});
					setLikedRoutes(initialLiked);
				}
			} catch (err) {
				console.error('Ошибка загрузки данных:', err);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [pathname]);

	const filteredRoutes = useMemo(() => {
		if (!searchQuery.trim()) return routes;

		const query = searchQuery.toLowerCase().trim();
		return routes.filter((route) =>
			route.title.toLowerCase().includes(query)
		);
	}, [routes, searchQuery]);

	const handleToggleLike = async (routeId: string) => {
		const isCurrentlyLiked = likedRoutes[routeId] || false;

		setLikedRoutes((prev) => ({
			...prev,
			[routeId]: !isCurrentlyLiked,
		}));

		try {
			let response;
			if (isCurrentlyLiked) {
				response = await removeFromFavoritesApi(routeId);
			} else {
				response = await toggleFavoriteApi(routeId);
			}

			if (!response.success) {
				setLikedRoutes((prev) => ({
					...prev,
					[routeId]: isCurrentlyLiked,
				}));
				return;
			}

			if (isFavoritesPage && isCurrentlyLiked) {
				setRoutes((prev) => prev.filter((r) => r.id !== routeId));
			}
		} catch (error) {
			setLikedRoutes((prev) => ({
				...prev,
				[routeId]: isCurrentlyLiked,
			}));
			console.error('Ошибка изменения избранного:', error);
		}
	};

	return (
		<section className={styles.container}>
			<div className={styles.headerRoutes}>
				<h1 className={styles.pageTitle}>{title}</h1>

				<div className={styles.actions}>
					<Input
						className={styles.search}
						placeholder='Введите название маршрута...'
						iconLeft={<Search />}
						inputPadding='5px 10px'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>

					<Button
						variant='tertiary'
						iconRight={<Filter />}
						onClick={() => navigate('/filter-mobile')}
					/>
				</div>
			</div>

			{loading ? (
				<div className={styles.loading}>Загрузка...</div>
			) : filteredRoutes.length > 0 ? (
				<div className={styles.routesContainer}>
					<div className={styles.positionGrid}>
						{filteredRoutes.map((route) => (
							<RouteCard
								key={route.id}
								route={route}
								imageUrl={
									routeImages[route.id] ||
									'/placeholder-route.jpg'
								}
								isLiked={likedRoutes[route.id] ?? false}
								onToggleLike={handleToggleLike}
								variant='standard'
							/>
						))}
					</div>
				</div>
			) : (
				<div className={styles.noResults}>
					<h2 className={styles.title}>
						{searchQuery.trim()
							? 'По вашему запросу ничего не найдено'
							: isFavoritesPage
								? 'В избранном пока пусто'
								: 'Маршруты не найдены'}
					</h2>
				</div>
			)}
		</section>
	);
};