import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';

import {
	searchRoutes,
	fetchRecommendedRoutes,
} from '../../services/slices/routeSlice/routeSlice';
import { getFavorites } from '../../services/slices/profileSlice/profileSlice'; // ← добавили
import { fetchAllTags } from '../../services/slices/tagsSlice/tagsSlice';

import { Filter, RouteCard } from '@components';
import { Filters } from '../../types/Filters';

import styles from './FilterDesktopPage.module.scss';

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

	const {
		searchResults,
		recommendedRoutes: paginatedRecommended,
		isLoading: routeLoading,
		error,
	} = useSelector((state) => state.routes);

	const { favorites: paginatedFavorites, loading: favoritesLoading } =
		useSelector((state) => state.profile);

	const { allTags } = useSelector((state) => state.tags);

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

	useEffect(() => {
		dispatch(fetchAllTags());

		if (listType === 'recommended') {
			dispatch(fetchRecommendedRoutes({ page: 0, size: 20 }));
		} else if (listType === 'favorites') {
			dispatch(getFavorites({ page: 0, size: 20 }));
		}
	}, [dispatch, listType]);

	const handleApplyFilters = useCallback(
		(filters: Filters) => {
			setActiveFilters(filters);

			const params: any = {
				search: filters.search?.trim() || undefined,
				type: filters.type,
				difficultyMin: filters.difficultyMin,
				difficultyMax: filters.difficultyMax,
				lengthMin:
					filters.lengthMin !== undefined && filters.lengthMin > 0
						? Math.floor(filters.lengthMin)
						: undefined,

				lengthMax:
					filters.lengthMax !== undefined && filters.lengthMax < 10000
						? Math.ceil(filters.lengthMax)
						: undefined,

				estimatedTimeMin:
					filters.estimatedTimeMin !== undefined
						? Math.floor(filters.estimatedTimeMin)
						: undefined,

				estimatedTimeMax:
					filters.estimatedTimeMax !== undefined
						? Math.ceil(filters.estimatedTimeMax)
						: undefined,

				tags:
					filters.tags && filters.tags.length > 0
						? filters.tags.join(',')
						: undefined,
				city: filters.city,
				favoriteOnly:
					listType === 'favorites' ? true : filters.favoriteOnly,
				hasAudioGuide: filters.hasAudioGuide,
				page: 0,
				size: 20,
			};

			dispatch(searchRoutes(params));
		},
		[dispatch, listType]
	);

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
								variant='standard'
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
