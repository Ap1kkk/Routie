import React from 'react';
import { RouteOnMap } from '@components';
import { YMaps } from '@pbe/react-yandex-maps';

const YANDEX_API_KEY = '9ca1260e-b884-4b25-8e40-ee3e8cd47988';
const LANGUAGE = 'ru_RU';

export const MapPage = () => {
	return (
		<section>
			<YMaps
				query={{
					apikey: YANDEX_API_KEY,
					lang: LANGUAGE,
				}}>
				<RouteOnMap />
			</YMaps>
		</section>
	);
};
