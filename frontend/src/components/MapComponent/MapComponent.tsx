import React, { useEffect, useRef } from 'react';
import mmrgl from 'mmr-gl';
import { decodePolyline } from './map';

import 'mmr-gl/dist/mmr-gl.css';
import styles from './MapComponent.module.scss';

interface RouteOnMapProps {
	routeData?: {
		checkpoints?: Array<{
			id: string;
			latitude: number;
			longitude: number;
			name?: string;
			description?: string;
		}>;
		name?: string;
	};
}

const API_MAP_KEY =
	'a47f57ddcdac37e56aa29e0001678c6f87e2ecbe91e52cc129eecbb01fd0d386';

export const MapComponent = ({ routeData }: RouteOnMapProps = {}) => {
	const mapRef = useRef<mmrgl.Map | null>(null);
	const markersRef = useRef<mmrgl.Marker[]>([]);

	const buildWalkingRoute = async (map: mmrgl.Map, checkpoints: any[]) => {
		const locations = checkpoints.map((p) => ({
			lat: p.latitude,
			lon: p.longitude,
		}));

		const requestBody = {
			locations,
			costing: 'pedestrian',
			units: 'kilometers',
			language: 'ru-RU',
		};

		try {
			const response = await fetch(
				'https://maps.vk.com/api/directions?api_key=a47f57ddcdac37e56aa29e0001678c6f87e2ecbe91e52cc129eecbb01fd0d386',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(requestBody),
				}
			);

			const data = await response.json();

			let allPoints: [number, number][] = [];

			if (data.trips?.[0]?.trip?.legs) {
				data.trips[0].trip.legs.forEach((leg: any) => {
					if (leg.shape) {
						const points = decodePolyline(leg.shape);
						const correctedPoints = points.map(
							(point) =>
								[
									point[0] / 10,
									point[1] / 10,
								] as [number, number]
						);

						allPoints = [...allPoints, ...correctedPoints];
					}
				});
			}

			if (allPoints.length > 0) {
				if (map.getLayer('route')) {
					map.removeLayer('route');
				}
				if (map.getSource('route')) {
					map.removeSource('route');
				}

				map.addSource('route', {
					type: 'geojson',
					data: {
						type: 'Feature',
						geometry: {
							type: 'LineString',
							coordinates: allPoints,
						},
					},
				});

				map.addLayer({
					id: 'route',
					type: 'line',
					source: 'route',
					layout: {
						'line-join': 'round',
						'line-cap': 'round',
					},
					paint: {
						'line-color': '#0c1317',
						'line-width': 4,
						'line-opacity': 0.9,
					},
				});
			}
		} catch (error) {
			console.error('Ошибка:', error);
		}
	};

	const addMarkers = (map: mmrgl.Map, checkpoints: any[]) => {
		markersRef.current.forEach((marker) => marker.remove());
		markersRef.current = [];

		checkpoints.forEach((point, index) => {
			const isFirst = index === 0;
			const isLast = index === checkpoints.length - 1;

			const marker = new mmrgl.Marker({
				color: isFirst ? '#4CAF50' : isLast ? '#f44336' : '#3FB1CE',
			})
				.setLngLat([point.longitude, point.latitude])
				.addTo(map);

			if (point.name) {
				const popup = new mmrgl.Popup({ offset: 25 }).setHTML(
					`<h3 style="margin: 0;">${point.name}</h3>`
				);
				marker.setPopup(popup);
			}

			markersRef.current.push(marker);
		});
	};

	useEffect(() => {
		mmrgl.accessToken = API_MAP_KEY;
		mmrgl.workerCount = 3;

		const map = new mmrgl.Map({
			container: 'map',
			zoom: 12,
			center: [43.990696, 56.313476],
			style: 'mmr://api/styles/main_style.json',
		});

		mapRef.current = map;

		map.on('load', () => {
			if (routeData?.checkpoints?.length) {
				addMarkers(map, routeData.checkpoints);
				buildWalkingRoute(map, routeData.checkpoints);

				const bounds = new mmrgl.LngLatBounds();
				routeData.checkpoints.forEach((p) =>
					bounds.extend([p.longitude, p.latitude])
				);
				map.fitBounds(bounds, { padding: 50 });
			}
		});

		return () => {
			markersRef.current.forEach((m) => m.remove());
			if (mapRef.current) {
				mapRef.current.remove();
			}
		};
	}, [routeData]);

	return <div id='map' className={styles.mapContainer} />;
};
