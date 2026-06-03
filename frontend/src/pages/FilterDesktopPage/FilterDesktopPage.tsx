// import React, { useEffect, useState } from 'react';
// import { Route } from '../../types/Route';
// import { Tags } from '../../types/Tags';
// import { Filters } from '../../types/filters';
// import { Filter, RouteCard } from '@components';
// import { mockRoutes } from '../../mocks/route';
//
// import styles from './FilterDesktopPage.module.scss';
//
// export const FilterDesktopPage: React.FC = () => {
// 	const [activeFilters, setActiveFilters] = useState<Filters | null>(null);
// 	const [recommendedRoutes, setRecommendedRoutes] = useState<Route[]>([]);
//
// 	const tags: Tags[] = [
// 		{ id: '1', title: 'Исторический' },
// 		{ id: '2', title: 'Природный' },
// 		{ id: '3', title: 'Городской' },
// 		{ id: '4', title: 'Водный' },
// 		{ id: '5', title: 'Горный' },
// 		{ id: '6', title: 'Архитектурный' },
// 		{ id: '7', title: 'Религиозный' },
// 		{ id: '8', title: 'Современный' },
// 	];
//
// 	useEffect(() => {
// 		const loadRoutes = () => {
// 			setRecommendedRoutes(mockRoutes);
// 		};
//
// 		const timer = setTimeout(loadRoutes, 500);
// 		return () => clearTimeout(timer);
// 	}, []);
//
// 	const handleApplyFilters = (filters: Filters) => {
// 		setActiveFilters(filters);
// 		console.log('Applied filters:', filters);
//
// 		let filteredRoutes = [...mockRoutes];
//
// 		if (filters.distance.min > 0 || filters.distance.max < Infinity) {
// 			filteredRoutes = filteredRoutes.filter(
// 				(route) =>
// 					route.distance >= filters.distance.min &&
// 					route.distance <= filters.distance.max
// 			);
// 		}
//
// 		if (
// 			filters.checkpointsCount.min > 0 ||
// 			filters.checkpointsCount.max < Infinity
// 		) {
// 			filteredRoutes = filteredRoutes.filter(
// 				(route) =>
// 					route.checkpoints.length >= filters.checkpointsCount.min &&
// 					route.checkpoints.length <= filters.checkpointsCount.max
// 			);
// 		}
//
// 		if (filters.categoryIds.length > 0) {
// 			filteredRoutes = filteredRoutes.filter((route) =>
// 				route.tags?.some((tag) => filters.categoryIds.includes(tag.id))
// 			);
// 		}
//
// 		setRecommendedRoutes(filteredRoutes);
// 	};
//
// 	const handleResetFilters = () => {
// 		setActiveFilters(null);
// 		setRecommendedRoutes(mockRoutes);
// 		console.log('Filters reset');
// 	};
//
// 	return (
// 		<section className={styles.container}>
// 			<Filter
// 				onApply={handleApplyFilters}
// 				onReset={handleResetFilters}
// 				tags={tags}
// 			/>
//
// 			{recommendedRoutes.length > 0 ? (
// 				<div className={styles.routesContainer}>
// 					<h2 className={styles.title}>
// 						{activeFilters
// 							? 'Отфильтрованные маршруты'
// 							: 'Рекомендованные маршруты'}
// 					</h2>
// 					<div className={styles.positionGrid}>
// 						{recommendedRoutes.map((route) => (
// 							<RouteCard
// 								key={route.id}
// 								route={route}
// 								variant='standard'
// 							/>
// 						))}
// 					</div>
// 				</div>
// 			) : (
// 				<div className={styles.noResults}>
// 					<h2 className={styles.title}>Маршруты не найдены</h2>
// 					<p>Попробуйте изменить параметры фильтрации</p>
// 				</div>
// 			)}
// 		</section>
// 	);
// };
