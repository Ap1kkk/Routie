import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { fetchRoute } from '../../services/slices/routeSlice/routeSlice';
import { MapComponent } from '@components';

import styles from './MapPage.module.scss';

export const MapPage = () => {
	const { routeId } = useParams<{ routeId: string }>();
	const dispatch = useDispatch();

	const { currentRoute, isLoading, error } = useSelector(
		(state) => state.routes
	);

	useEffect(() => {
		if (routeId) {
			dispatch(fetchRoute(routeId));
		}
	}, [routeId, dispatch]);

	if (isLoading) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка: {error}</div>;
	if (!currentRoute) return <div>Маршрут не найден</div>;

	return (
		<section className={styles.mapPageWrapper}>
			<MapComponent routeData={currentRoute} />
		</section>
	);
};
