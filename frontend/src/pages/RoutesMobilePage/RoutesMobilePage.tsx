import React, { useEffect, useState } from 'react';
import { mockRoutes } from '../../mocks/route';
import { Route } from '../../types/route';
import styles from './RoutesMobilePage.module.scss';
import { RouteCard } from '@components';
import { Button, Input } from '@ui';
import { ReactComponent as Filter } from '../../assets/icons/filter-square.svg';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Search } from '../../assets/icons/search.svg';

export const RoutesMobilePage = () => {
	const navigate = useNavigate();
	const [recommendedRoutes, setRecommendedRoutes] = useState<Route[]>([]);

	useEffect(() => {
		const loadRoutes = () => {
			setRecommendedRoutes(mockRoutes);
		};

		const timer = setTimeout(loadRoutes, 500);
		return () => clearTimeout(timer);
	}, []);

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
					onClick={() => navigate('/filter-mobile')}
				/>
			</div>
			{recommendedRoutes.length > 0 ? (
				<div className={styles.routesContainer}>
					<div className={styles.positionGrid}>
						{recommendedRoutes.map((route) => (
							<RouteCard
								key={route.id}
								route={route}
								variant='standard'
							/>
						))}
					</div>
				</div>
			) : (
				<div className={styles.noResults}>
					<h2 className={styles.title}>Маршруты не найдены</h2>
					<p>Попробуйте изменить параметры фильтрации</p>
				</div>
			)}
		</section>
	);
};
