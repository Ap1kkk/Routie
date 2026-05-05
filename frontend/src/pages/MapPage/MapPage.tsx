import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { YMaps } from '@pbe/react-yandex-maps';
import { getMockRouteById } from '../../mocks/route';
import { Route } from '../../types/route';
import { MapComponent } from '@components';

const YANDEX_API_KEY = '9ca1260e-b884-4b25-8e40-ee3e8cd47988';
const LANGUAGE = 'ru_RU';

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
