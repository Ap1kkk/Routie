import React, { useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { RouteCard } from '@components';
import { Button, Input } from '@ui';
import { routeApi } from '../../utils/api/RoutesApi';
import { Route } from '../../types/Route';

import { ReactComponent as Filter } from '../../assets/icons/filter-square.svg';
import { ReactComponent as Search } from '../../assets/icons/search.svg';

import styles from './RoutesMobilePage.module.scss';

type LoaderData = {
	routes: Route[];
	routeImages: Record<string, string | null>;
	title: string;
	isFavoritesPage: boolean;
};

export const RoutesMobilePage = () => {
	const navigate = useNavigate();
	const loaderData = useLoaderData() as LoaderData;

	const {
		routes: initialRoutes = [],
		routeImages = {},
		title = 'Маршруты',
		isFavoritesPage = false,
	} = loaderData;

	const [localRoutes, setLocalRoutes] = useState<Route[]>(initialRoutes);
	const [searchQuery, setSearchQuery] = useState('');
	const [likedRoutes, setLikedRoutes] = useState<Record<string, boolean>>({});

	useEffect(() => {
		setLocalRoutes(initialRoutes);
		setSearchQuery('');
		setLikedRoutes({});
	}, [initialRoutes]);

	useEffect(() => {
		const loadFavorites = async () => {
			try {
				const res = await routeApi.getFavorites({ page: 0, size: 100 });
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

	const filteredRoutes = useMemo(() => {
		if (!searchQuery.trim()) return localRoutes;

		const query = searchQuery.toLowerCase().trim();
		return localRoutes.filter((route) =>
			route.title.toLowerCase().includes(query)
		);
	}, [localRoutes, searchQuery]);

	const handleToggleLike = async (routeId: string) => {
		const isCurrentlyLiked = likedRoutes[routeId] || false;

		setLikedRoutes((prev) => ({
			...prev,
			[routeId]: !isCurrentlyLiked,
		}));

		try {
			let response;
			if (isCurrentlyLiked) {
				response = await routeApi.removeFavorites(routeId);
			} else {
				response = await routeApi.toggleFavorite(routeId);
			}

			if (!response.success) {
				setLikedRoutes((prev) => ({
					...prev,
					[routeId]: isCurrentlyLiked,
				}));
				return;
			}

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
