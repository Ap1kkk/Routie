import React, { useEffect, useRef } from 'react';
import mmrgl from 'mmr-gl';
import 'mmr-gl/dist/mmr-gl.css';
import styles from './MapComponent.module.scss';

interface RouteOnMapProps {
	routeData?: {
		checkpoints?: Array<{
			id: string;
			latitude: number;
			longitude: number;
			order: number;
			name?: string;
			description?: string;
		}>;
		name?: string;
	};
}

export const MapComponent = ({ routeData }: RouteOnMapProps = {}) => {
	const mapRef = useRef<mmrgl.Map | null>(null);
	const markersRef = useRef<mmrgl.Marker[]>([]);

	const buildWalkingRoute = async (map: mmrgl.Map, checkpoints: any[]) => {
		if (checkpoints.length < 2) return;

		const coordinates = checkpoints.map(p => `${p.longitude},${p.latitude}`).join(';');
		const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${coordinates}?geometries=polyline&overview=full`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.routes && data.routes[0]) {
				const points = decodePolyline(data.routes[0].geometry);

				if (map.getSource('route')) {
					map.removeSource('route');
				}
				if (map.getLayer('route')) {
					map.removeLayer('route');
				}

				map.addSource('route', {
					type: 'geojson',
					data: {
						type: 'Feature',
						geometry: {
							type: 'LineString',
							coordinates: points
						}
					}
				});

				map.addLayer({
					id: 'route',
					type: 'line',
					source: 'route',
					paint: {
						'line-color': '#3FB1CE',
						'line-width': 4,
						'line-opacity': 0.9
					}
				});

				const distance = (data.routes[0].distance / 1000).toFixed(2);
				const duration = Math.round(data.routes[0].duration / 60);
				console.log(`Пеший маршрут: ${distance} км, ~${duration} минут`);
			}
		} catch (error) {
			console.error('Ошибка построения маршрута:', error);
		}
	};

	const decodePolyline = (str: string): [number, number][] => {
		let index = 0;
		let lat = 0;
		let lng = 0;
		const coordinates: [number, number][] = [];

		while (index < str.length) {
			let result = 0;
			let shift = 0;
			let b;

			do {
				b = str.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
			lat += dlat;

			result = 0;
			shift = 0;

			do {
				b = str.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);

			const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
			lng += dlng;

			coordinates.push([lng / 1e5, lat / 1e5]);
		}

		return coordinates;
	};

	const addMarkers = (map: mmrgl.Map, checkpoints: any[]) => {
		markersRef.current.forEach(marker => marker.remove());
		markersRef.current = [];

		checkpoints.forEach((point, index) => {
			const isFirst = index === 0;
			const isLast = index === checkpoints.length - 1;

			const marker = new mmrgl.Marker({
				color: isFirst ? '#4CAF50' : isLast ? '#f44336' : '#3FB1CE'
			})
				.setLngLat([point.longitude, point.latitude])
				.addTo(map);

			if (point.name) {
				const popup = new mmrgl.Popup({ offset: 25 })
					.setHTML(`<h3 style="margin: 0;">${point.name}</h3>`);
				marker.setPopup(popup);
			}

			markersRef.current.push(marker);
		});
	};

	useEffect(() => {
		mmrgl.accessToken = 'a47f57ddcdac37e56aa29e0001678c6f87e2ecbe91e52cc129eecbb01fd0d386';
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
				routeData.checkpoints.forEach(p => bounds.extend([p.longitude, p.latitude]));
				map.fitBounds(bounds, { padding: 50 });
			}
		});

		return () => {
			markersRef.current.forEach(m => m.remove());
			if (mapRef.current) {
				mapRef.current.remove();
			}
		};
	}, [routeData]);

	return <div id="map" className={styles.mapContainer} />;
};