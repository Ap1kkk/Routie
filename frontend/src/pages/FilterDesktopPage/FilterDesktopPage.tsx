import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';

import { searchRoutes, fetchRecommendedRoutes } from '../../services/slices/routeSlice/routeSlice';
import { getFavorites } from '../../services/slices/profileSlice/profileSlice'; // ← добавили
import { fetchAllTags } from '../../services/slices/tagsSlice/tagsSlice';

import { Filter, RouteCard } from '@components';
import { Route } from '../../types/Route';

import styles from './FilterDesktopPage.module.scss';
import { Filters } from '../../types/Filters';

type ListType = 'recommended' | 'popular' | 'favorites';

export const FilterDesktopPage: React.FC = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	const getListType = (): ListType => {
		if (location.pathname.includes('/recommended')) return 'recommended';
		if (location.pathname.includes('/popular')) return 'popular';
		if (location.pathname.includes('/favorites')) return 'favorites';
		return 'recommended';
	};

	const listType = getListType();

	// Redux
	const { searchResults, recommendedRoutes: paginatedRecommended, isLoading: routeLoading, error } = useSelector(
		(state) => state.routes
	);

	const { favorites: paginatedFavorites, loading: favoritesLoading } = useSelector(
		(state) => state.profile
	);

	const { allTags } = useSelector((state) => state.tags);

	// Выбираем нужный список в зависимости от типа страницы
	const getCurrentRoutes = () => {
		if (listType === 'favorites') {
			return paginatedFavorites?.content || [];
		}
		return searchResults?.content || paginatedRecommended?.content || [];
	};

	const routesList = getCurrentRoutes();

	const [activeFilters, setActiveFilters] = useState<Filters | null>(null);

	const pageTitles: Record<ListType, string> = {
		recommended: 'Рекомендованные маршруты',
		popular: 'Популярные маршруты',
		favorites: 'Избранные маршруты',
	};

	const currentTitle = pageTitles[listType];

	// Загрузка данных
	useEffect(() => {
		dispatch(fetchAllTags());

		if (listType === 'recommended') {
			dispatch(fetchRecommendedRoutes({ page: 0, size: 20 }));
		} else if (listType === 'favorites') {
			dispatch(getFavorites({ page: 0, size: 20 }));
		}
		// popular — позже
	}, [dispatch, listType]);

	// Применение фильтров (пока только для recommended и общего поиска)
	const handleApplyFilters = useCallback((filters: Filters) => {
		setActiveFilters(filters);

		const params: any = {
			search: filters.search?.trim() || undefined,
			type: filters.type,
			difficultyMin: filters.difficultyMin,
			difficultyMax: filters.difficultyMax,
			lengthMin: filters.distance.min > 0 ? Math.floor(filters.distance.min) : undefined,
			lengthMax: filters.distance.max < 100000 ? Math.ceil(filters.distance.max) : undefined,
			estimatedTimeMin: filters.duration?.min !== undefined ? Math.floor(filters.duration.min) : undefined,
			estimatedTimeMax: filters.duration?.max !== undefined ? Math.ceil(filters.duration.max) : undefined,
			city: filters.city,
			tags: filters.categoryIds.length > 0 ? filters.categoryIds.join(',') : undefined,
			favoriteOnly: listType === 'favorites' ? true : filters.favoriteOnly,
			hasAudioGuide: filters.hasAudioGuide,
			page: 0,
			size: 20,
		};

		dispatch(searchRoutes(params));
	}, [dispatch, listType]);

	const handleResetFilters = () => {
		setActiveFilters(null);

		if (listType === 'recommended') {
			dispatch(fetchRecommendedRoutes({ page: 0, size: 20 }));
		} else if (listType === 'favorites') {
			dispatch(getFavorites({ page: 0, size: 20 }));
		} else {
			dispatch(searchRoutes({ page: 0, size: 20 }));
		}
	};

	const isLoading = routeLoading || favoritesLoading;

	return (
		<section className={styles.container}>
			<Filter
				onApply={handleApplyFilters}
				onReset={handleResetFilters}
				tags={allTags || []}
			/>

			<div className={styles.routesContainer}>
				<h2 className={styles.title}>{currentTitle}</h2>

				{isLoading && <div>Загрузка маршрутов...</div>}
				{error && <div className={styles.error}>Ошибка: {error}</div>}

				{routesList.length > 0 ? (
					<div className={styles.positionGrid}>
						{routesList.map((route) => (
							<RouteCard
								key={route.id}
								route={route}
								variant="standard"
							/>
						))}
					</div>
				) : (
					<div className={styles.noResults}>
						<h2>Маршруты не найдены</h2>
						<p>Попробуйте изменить параметры фильтрации</p>
					</div>
				)}
			</div>
		</section>
	);
};