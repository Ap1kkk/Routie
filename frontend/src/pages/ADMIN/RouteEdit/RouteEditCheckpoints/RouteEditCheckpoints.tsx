import React, { useEffect, useRef, useState } from 'react';
import mmrgl from 'mmr-gl';
import 'mmr-gl/dist/mmr-gl.css';
import { useDispatch, useSelector } from '@store';
import { Button, Input } from '@ui';
import { useNavigate } from 'react-router-dom';
import { searchLandmarks } from '../../../../services/slices/landmarkSlice/landmarkSlice';
import { setDraft } from '../../../../services/slices/routeDraftSlice/routeDraftSlice';
import { decodePolyline } from '../../../../components/MapComponent/map';

import styles from './RouteEditCheckpoints.module.scss';

const API_MAP_KEY =
	'a47f57ddcdac37e56aa29e0001678c6f87e2ecbe91e52cc129eecbb01fd0d386';

export const RouteEditCheckpoints = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const draft = useSelector((state) => state.routeDraft);

	const checkpoints = useSelector((state) => state.routeDraft.checkpoints);

	const { searchResults: landmarks } = useSelector(
		(state) => state.landmarks
	);

	const [openedLandmarkIndex, setOpenedLandmarkIndex] = useState<
		number | null
	>(null);

	const mapRef = useRef<mmrgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const markersRef = useRef<mmrgl.Marker[]>([]);

	useEffect(() => {
		mmrgl.accessToken = API_MAP_KEY;

		const map = new mmrgl.Map({
			container: mapContainerRef.current!,
			style: 'mmr://api/styles/main_style.json',
			center: [43.990696, 56.313476],
			zoom: 12,
		});

		mapRef.current = map;

		return () => map.remove();
	}, []);

	useEffect(() => {
		if (!mapRef.current) return;
		const validCheckpoints = checkpoints.filter(
			(cp) => cp.latitude !== 0 && cp.longitude !== 0
		);
		drawMarkers();
		if (validCheckpoints.length >= 2) {
			buildRoute(mapRef.current, validCheckpoints);
		}
		if (validCheckpoints.length > 0) {
			fitToCheckpoints();
		}
		fitToCheckpoints();
	}, [checkpoints]);

	const drawMarkers = () => {
		markersRef.current.forEach((m) => m.remove());
		markersRef.current = [];
		checkpoints
			.filter((cp) => cp.latitude !== 0 && cp.longitude !== 0)
			.forEach((cp) => {
				const marker = new mmrgl.Marker()
					.setLngLat([cp.longitude, cp.latitude])
					.addTo(mapRef.current!);

				markersRef.current.push(marker);
			});
	};

	const fitToCheckpoints = () => {
		if (!mapRef.current || checkpoints.length === 0) return;

		const bounds = new mmrgl.LngLatBounds();

		checkpoints.forEach((cp) => {
			bounds.extend([cp.longitude, cp.latitude]);
		});

		mapRef.current.fitBounds(bounds, {
			padding: 300,
			duration: 500,
		});
	};

	const clearRoute = (map: mmrgl.Map) => {
		try {
			if (map.getLayer('route-outline')) {
				map.removeLayer('route-outline');
			}

			if (map.getLayer('route')) {
				map.removeLayer('route');
			}

			if (map.getSource('route')) {
				map.removeSource('route');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const buildRoute = async (map: mmrgl.Map, checkpoints: any[]) => {
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
				`https://maps.vk.com/api/directions?api_key=${API_MAP_KEY}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(requestBody),
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`Ошибка API (${response.status})`, errorText);
				return;
			}

			const data = await response.json();

			let allPoints: [number, number][] = [];

			data.trips[0].trip.legs.forEach((leg: any) => {
				if (leg.shape) {
					const points = decodePolyline(leg.shape);

					const correctedPoints = points.map(
						(point) =>
							[point[0] / 10, point[1] / 10] as [number, number]
					);

					allPoints.push(...correctedPoints);
				}
			});

			if (!allPoints.length) {
				console.error('Пустой маршрут', data);
				return;
			}

			clearRoute(map);

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
				id: 'route-outline',
				type: 'line',
				source: 'route',
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					'line-color': '#13BBFA',
					'line-width': [
						'interpolate',
						['exponential', 1.5],
						['zoom'],
						5,
						3,
						18,
						8,
					],
					'line-opacity': 1,
				},
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		dispatch(
			searchLandmarks({
				page: 0,
				size: 100,
			})
		);
	}, []);

	const addCheckpoint = () => {
		dispatch(
			setDraft({
				checkpoints: [
					...draft.checkpoints,
					{
						latitude: 0,
						longitude: 0,
						landmarkId: '',
						landmarkSearch: '',
					},
				],
			})
		);
	};

	const removeCheckpoint = (index: number) => {
		dispatch(
			setDraft({
				checkpoints: draft.checkpoints.filter((_, i) => i !== index),
			})
		);
	};

	const updateCheckpoint = (
		index: number,
		field: string,
		value: string | number
	) => {
		dispatch(
			setDraft({
				checkpoints: draft.checkpoints.map((cp, i) =>
					i === index
						? {
								...cp,
								[field]: value,
						  }
						: cp
				),
			})
		);
	};

	return (
		<section className={styles.section}>
			<div ref={mapContainerRef} className={styles.map} />

			<div className={styles.sidebar}>
				<div className={styles.header}>
					<h2>Точки маршрута</h2>

					<Button variant='primary' onClick={() => navigate(-1)}>
						Назад
					</Button>
				</div>

				<Button variant='primary' onClick={addCheckpoint}>
					Добавить точку
				</Button>

				<div className={styles.checkpoints}>
					{draft.checkpoints.map((checkpoint, index) => (
						<div key={index} className={styles.card}>
							<h4>Точка №{index + 1}</h4>

							<div className={styles.containerCard}>
								<div className={styles.coordinates}>
									<Input
										type='number'
										placeholder='Широта'
										inputPadding={'4px 12px'}
										value={checkpoint.latitude}
										onChange={(e) =>
											updateCheckpoint(
												index,
												'latitude',
												Number(e.target.value)
											)
										}
									/>

									<Input
										type='number'
										placeholder='Долгота'
										inputPadding={'4px 12px'}
										value={checkpoint.longitude}
										onChange={(e) =>
											updateCheckpoint(
												index,
												'longitude',
												Number(e.target.value)
											)
										}
									/>
								</div>

								<div className={styles.autocomplete}>
									<Input
										placeholder='Поиск достопримечательности'
										value={checkpoint.landmarkSearch}
										inputPadding={'4px 12px'}
										onFocus={() =>
											setOpenedLandmarkIndex(index)
										}
										onChange={(e) => {
											updateCheckpoint(
												index,
												'landmarkSearch',
												e.target.value
											);

											setOpenedLandmarkIndex(index);
										}}
									/>

									{openedLandmarkIndex === index && (
										<div className={styles.dropdown}>
											{(landmarks?.content ?? [])
												.filter((landmark) =>
													landmark.title
														.toLowerCase()
														.includes(
															checkpoint.landmarkSearch.toLowerCase()
														)
												)
												.map((landmark) => (
													<div
														key={landmark.id}
														className={
															styles.option
														}
														onClick={() => {
															dispatch(
																setDraft({
																	checkpoints:
																		draft.checkpoints.map(
																			(
																				cp,
																				i
																			) =>
																				i ===
																				index
																					? {
																							...cp,
																							landmarkId:
																								landmark.id,
																							landmarkSearch:
																								landmark.title,
																					  }
																					: cp
																		),
																})
															);

															setOpenedLandmarkIndex(
																null
															);
														}}>
														{landmark.title}
													</div>
												))}
										</div>
									)}
								</div>
							</div>

							<Button
								variant='secondary'
								onClick={() => removeCheckpoint(index)}>
								Удалить
							</Button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
