import React, { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { RouteCard } from '@components';
import { Button, Input } from '@ui';

import { ReactComponent as Filter } from '../../assets/icons/filter-square.svg';
import { ReactComponent as Search } from '../../assets/icons/search.svg';

import styles from './RoutesMobilePage.module.scss';
import { Route } from '../../types/Route';
import {
	getFavoritesApi,
	removeFromFavoritesApi,
	toggleFavoriteApi,
} from '../../utils/api/RoutesApi';

type LoaderData = {
	routes: Route[];
	routeImages: Record<string, string>;
	title: string;
	isFavoritesPage: boolean;
};

export const RoutesMobilePage = () => {
	const navigate = useNavigate();

	const {
		routes: initialRoutes,
		routeImages,
		title,
		isFavoritesPage,
	} = useLoaderData() as LoaderData;

	const [localRoutes, setLocalRoutes] = useState<Route[]>(initialRoutes);
	const [searchQuery, setSearchQuery] = useState('');
	const [likedRoutes, setLikedRoutes] = useState<Record<string, boolean>>({});

	// Загружаем актуальное состояние избранного (как на главной странице)
	useEffect(() => {
		const loadFavorites = async () => {
			try {
				const res = await getFavoritesApi({ page: 0, size: 100 });
				if (res.success && res.data?.content) {
					const favoriteIds = new Set(
						res.data.content.map((r) => r.id)
					);

					const initialLiked: Record<string, boolean> = {};
					initialRoutes.forEach((route) => {
						initialLiked[route.id] = favoriteIds.has(route.id);
					});

					setLikedRoutes(initialLiked);
				}
			} catch (err) {
				console.error('Не удалось загрузить избранное:', err);
			}
		};

		loadFavorites();
	}, [initialRoutes]);

	// Фильтрация по поиску
	const filteredRoutes = useMemo(() => {
		if (!searchQuery.trim()) return localRoutes;

		const query = searchQuery.toLowerCase().trim();
		return localRoutes.filter((route) =>
			route.title.toLowerCase().includes(query)
		);
	}, [localRoutes, searchQuery]);

	// Toggle избранного
	const handleToggleLike = async (routeId: string) => {
		const isCurrentlyLiked = likedRoutes[routeId] || false;

		// Оптимистическое обновление
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

			// Если удалили из избранного и мы на странице избранного — убираем из списка
			if (isFavoritesPage && isCurrentlyLiked) {
				setLocalRoutes((prev) =>
					prev.filter((route) => route.id !== routeId)
				);
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

			{filteredRoutes.length > 0 ? (
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
