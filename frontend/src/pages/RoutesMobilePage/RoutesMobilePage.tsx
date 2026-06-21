import React, { useEffect, useMemo, useState } from 'react';
import { RouteCard } from '@components';
import { Button, Input } from '@ui';
import { ReactComponent as Filter } from '../../assets/icons/filter-square.svg';
import { ReactComponent as Search } from '../../assets/icons/search.svg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { searchRoutes } from '../../services/slices/routeSlice/routeSlice';
import { downloadFile } from '../../services/slices/fileSlice/fileSlice';

import styles from './RoutesMobilePage.module.scss';
import { Filters } from '../../types/Filters';

export const RoutesMobilePage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { searchResults, isLoading } = useSelector((state) => state.routes);
	const [routeImages, setRouteImages] = useState<Record<string, string>>({});

	const filters = useSelector((state) => state.filters.filters);

	const routes = useMemo(
		() => searchResults?.content?.filter((route) => route.isActive) ?? [],
		[searchResults]
	);

	const buildSearchParams = (filters: Filters) => ({
		search: filters.search || undefined,
		lengthMin: filters.lengthMin || undefined,
		lengthMax: filters.lengthMax !== 10000 ? filters.lengthMax : undefined,
		estimatedTimeMin: filters.estimatedTimeMin || undefined,
		estimatedTimeMax:
			filters.estimatedTimeMax !== 24
				? filters.estimatedTimeMax
				: undefined,
		tags: filters.tags?.length ? filters.tags.join(',') : undefined,
		hasAudioGuide: filters.hasAudioGuide,
		favoriteOnly: filters.favoriteOnly,
		page: 0,
		size: 20,
	});

	useEffect(() => {
		dispatch(searchRoutes(buildSearchParams(filters)));
	}, [dispatch, filters]);

	useEffect(() => {
		const loadImages = async () => {
			const imageMap: Record<string, string> = { ...routeImages };

			for (const route of routes) {
				if (route.images?.length > 0 && !imageMap[route.id]) {
					const fileId = route.images[0].id;
					try {
						imageMap[route.id] = await dispatch(
							downloadFile(fileId)
						).unwrap();
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

		if (routes.length > 0) loadImages();

		return () => {
			Object.values(routeImages).forEach((url) =>
				URL.revokeObjectURL(url)
			);
		};
	}, [routes, dispatch]);

	return (
		<section className={styles.container}>
			<div className={styles.headerRoutes}>
				<Input
					className={styles.search}
					placeholder={'Введите название маршрута...'}
					iconLeft={<Search />}
					inputPadding='5px 10px'
				/>
				<Button
					variant='tertiary'
					iconRight={<Filter />}
					children={'Фильтры'}
					onClick={() => navigate('/filter-mobile')}
				/>
			</div>
			{isLoading ? (
				<div>Загрузка...</div>
			) : routes.length > 0 ? (
				<div className={styles.routesContainer}>
					<div className={styles.positionGrid}>
						{routes.map((route) => (
							<RouteCard
								key={route.id}
								route={route}
								imageUrl={routeImages[route.id]}
								variant='standard'
							/>
						))}
					</div>
				</div>
			) : (
				<div className={styles.noResults}>
					<h2 className={styles.title}>Маршруты не найдены</h2>
				</div>
			)}
		</section>
	);
};
