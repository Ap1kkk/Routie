import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMockRouteById } from '../../mocks/route';
import { Route } from '../../types/route';
import { MapComponent } from '@components';

export const MapPage = () => {
	const { routeId } = useParams<{ routeId: string }>();
	const [route, setRoute] = useState<Route | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (routeId) {
			const foundRoute = getMockRouteById(routeId);
			setRoute(foundRoute || null);
		}
		setLoading(false);
	}, [routeId]);

	if (loading) return <div>Загрузка...</div>;
	if (!route) return <div>Маршрут не найден</div>;

	return (
		<section>
			<MapComponent route={route} />
		</section>
	);
};
