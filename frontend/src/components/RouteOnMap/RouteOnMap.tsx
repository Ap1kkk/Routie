import React, { useState } from 'react';
import { YMaps, Map, Placemark, useYMaps } from '@pbe/react-yandex-maps';
import styled from 'styled-components';

const CENTER = [56.328461, 44.003061];
const ZOOM = 12;

type CoordinatesType = Array<number>;

const MapWithGeocode = styled(Map)`
	width: 100%;
	height: 500px;
	border: 1px solid black;
	border-radius: 10px;
	overflow: hidden;
`;

interface IMapClickEvent {
	get: (key: string) => CoordinatesType;
}

export const RouteOnMap = () => {
	const [coordinates, setCoordinates] = useState<CoordinatesType | null>(
		null
	);
	const [hasPanorama, setHasPanorama] = useState<boolean>(false);
	const ymaps = useYMaps(['geocode']);

	const handleClickMap = (e: IMapClickEvent) => {
		const coords = e.get('coords');

		if (coords) {
			setCoordinates(coords);
		}

		ymaps?.panorama
			.locate(coords)
			.then((panorama) => {
				setHasPanorama(!!panorama.length);
			})
			.catch((error) => {
				console.log('Ошибка при поиске панорамы', error);
				setHasPanorama(false);
			});
	};

	return (
		<MapWithGeocode
			defaultState={{
				center: CENTER,
				zoom: ZOOM,
			}}
			onClick={(e: IMapClickEvent) => handleClickMap(e)}>
			{coordinates && <Placemark geometry={coordinates}
			/>}
		</MapWithGeocode>
	);
};
