import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import './RouteEdit.module.scss';
import { CheckpointCreate, Route, RouteType } from '../../../types/Route';
import {
	createNewRoute,
	fetchRoute,
	routeDelete,
	routeImagesUpload,
	routePublish,
	routeUpdate,
	searchRoutes,
} from '../../../services/slices/routeSlice/routeSlice';
import { fetchAllTags } from '../../../services/slices/tagsSlice/tagsSlice';
import { searchLandmarks } from '../../../services/slices/landmarkSlice/landmarkSlice';
import { Button, Input, Modal } from '@ui';

import styles from './RouteEdit.module.scss';

type TCheckpointForm = {
	latitude: number;
	longitude: number;
	landmarkId: string;
};

export const RouteEdit = () => {
	const dispatch = useDispatch();

	const { searchResults, isLoading } = useSelector((state) => state.routes);

	const { allTags } = useSelector((state) => state.tags);

	const { searchResults: landmarks } = useSelector(
		(state) => state.landmarks
	);

	const [editingRoute, setEditingRoute] = useState<Route | null>(null);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [type, setType] = useState<RouteType>('TOURIST');
	const [difficulty, setDifficulty] = useState(1);
	const [lengthMeters, setLengthMeters] = useState(0);
	const [estimatedTimeMinutes, setEstimatedTimeMinutes] = useState(0);
	const [city, setCity] = useState('');

	const [checkpoints, setCheckpoints] = useState<TCheckpointForm[]>([]);
	const [images, setImages] = useState<FileList | null>(null);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		dispatch(
			searchRoutes({
				page: 0,
				size: 100,
			})
		);

		dispatch(fetchAllTags());

		dispatch(
			searchLandmarks({
				page: 0,
				size: 100,
			})
		);
	}, []);

	const openCreateModal = () => {
		resetForm();
		setIsModalOpen(true);
	};

	const closeModal = () => {
		resetForm();
		setIsModalOpen(false);
	};

	const resetForm = () => {
		setEditingRoute(null);

		setTitle('');
		setDescription('');
		setType('TOURIST');

		setDifficulty(1);
		setLengthMeters(0);
		setEstimatedTimeMinutes(0);

		setCity('');

		setSelectedTags([]);
		setCheckpoints([]);

		setImages(null);
	};

	const addCheckpoint = () => {
		setCheckpoints((prev) => [
			...prev,
			{
				latitude: 0,
				longitude: 0,
				landmarkId: '',
			},
		]);
	};

	const removeCheckpoint = (index: number) => {
		setCheckpoints((prev) => prev.filter((_, i) => i !== index));
	};

	const updateCheckpoint = (
		index: number,
		field: keyof TCheckpointForm,
		value: string | number
	) => {
		setCheckpoints((prev) =>
			prev.map((cp, i) =>
				i === index
					? {
							...cp,
							[field]: value,
					  }
					: cp
			)
		);
	};

	const preparedCheckpoints: CheckpointCreate[] = checkpoints.map(
		(cp, index) => ({
			latitude: cp.latitude,
			longitude: cp.longitude,
			landmarkId: cp.landmarkId,
			sortOrder: index,
		})
	);

	const handleCreate = async () => {
		console.log(
			JSON.stringify(
				{
					title,
					description,
					type,
					difficulty,
					lengthMeters,
					estimatedTimeMinutes,
					city,
					tagIds: selectedTags,
					checkpoints: preparedCheckpoints,
				},
				null,
				2
			)
		);

		const result = await dispatch(
			createNewRoute({
				title,
				description,
				type,
				difficulty,
				lengthMeters,
				estimatedTimeMinutes,
				city,
				tagIds: selectedTags,
				checkpoints: preparedCheckpoints,
			})
		);

		if (!createNewRoute.fulfilled.match(result)) return;

		if (images) {
			for (const file of Array.from(images)) {
				await dispatch(
					routeImagesUpload({
						routeId: result.payload.id,
						file,
					})
				);
			}
		}

		closeModal();

		dispatch(
			searchRoutes({
				page: 0,
				size: 100,
			})
		);
	};

	const handleUpdate = async () => {
		if (!editingRoute) return;

		await dispatch(
			routeUpdate({
				routeId: editingRoute.id,
				data: {
					title,
					description,
					type,
					difficulty,
					lengthMeters,
					estimatedTimeMinutes,
					city,
					tagIds: selectedTags,
					checkpoints: preparedCheckpoints,
				},
			})
		);

		if (images) {
			for (const file of Array.from(images)) {
				await dispatch(
					routeImagesUpload({
						routeId: editingRoute.id,
						file,
					})
				);
			}
		}

		closeModal();

		dispatch(
			searchRoutes({
				page: 0,
				size: 100,
			})
		);
	};

	const handleDelete = async (routeId: string) => {
		if (!window.confirm('Удалить маршрут?')) return;

		await dispatch(routeDelete(routeId));

		dispatch(
			searchRoutes({
				page: 0,
				size: 100,
			})
		);
	};

	const handlePublish = async (routeId: string) => {
		await dispatch(routePublish(routeId));

		dispatch(
			searchRoutes({
				page: 0,
				size: 100,
			})
		);
	};

	const startEdit = async (route: Route) => {
		const result = await dispatch(fetchRoute(route.id));

		if (!fetchRoute.fulfilled.match(result)) return;

		const fullRoute = result.payload;

		setEditingRoute(route);

		setTitle(fullRoute.title);
		setDescription(fullRoute.description);
		setType(fullRoute.type as RouteType);

		setDifficulty(fullRoute.difficulty);
		setLengthMeters(fullRoute.lengthMeters);
		setEstimatedTimeMinutes(fullRoute.estimatedTimeMinutes);

		setCity(fullRoute.city);

		setCheckpoints(
			fullRoute.checkpoints.map((cp) => ({
				latitude: cp.latitude,
				longitude: cp.longitude,
				landmarkId: cp.landmark.id,
			}))
		);

		setSelectedTags(fullRoute.tags.map((tag) => tag.id));

		setIsModalOpen(true);
	};

	return (
		<section className={styles.section}>
			<h3 className={styles.title}>Управление маршрутами</h3>

			<div className={styles.headerActions}>
				<Button variant='primary' onClick={openCreateModal}>
					Создать маршрут
				</Button>
			</div>

			{isLoading && <p>Загрузка...</p>}

			<table className={styles.table}>
				<thead className={styles.tableHead}>
					<tr className={styles.tableRow}>
						<th className={styles.tableHeader}>Название</th>
						<th className={styles.tableHeader}>Тип</th>
						<th className={styles.tableHeader}>Город</th>
						<th className={styles.tableHeader}>Сложность</th>
						<th className={styles.tableHeader}>Длина</th>
						<th className={styles.tableHeader}>Статус</th>
						<th className={styles.tableHeader}>Действия</th>
					</tr>
				</thead>

				<tbody className={styles.tableBody}>
					{searchResults?.content.map((route) => (
						<tr key={route.id} className={styles.tableRow}>
							<td className={styles.tableCell}>{route.title}</td>

							<td className={styles.tableCell}>{route.type}</td>

							<td className={styles.tableCell}>{route.city}</td>

							<td className={styles.tableCell}>
								{route.difficulty}
							</td>

							<td className={styles.tableCell}>
								{route.lengthMeters} м
							</td>

							<td className={styles.tableCell}>
								{route.isActive ? 'Опубликован' : 'Черновик'}
							</td>

							<td className={styles.tableCell}>
								<div className={styles.actions}>
									<Button
										variant='primary'
										onClick={() => startEdit(route)}>
										Редактировать
									</Button>

									<Button
										variant='secondary'
										onClick={() => handleDelete(route.id)}>
										Удалить
									</Button>

									{!route.isActive && (
										<Button
											variant='primary'
											onClick={() =>
												handlePublish(route.id)
											}>
											Опубликовать
										</Button>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				className={styles.modal}>
				<div className={styles.modalContent}>
					<h3>
						{editingRoute
							? 'Редактирование маршрута'
							: 'Создание маршрута'}
					</h3>

					<div className={styles.formGroup}>
						<label>Название</label>

						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Описание</label>

						<textarea
							className={styles.textarea}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Тип маршрута</label>

						<select
							className={styles.select}
							value={type}
							onChange={(e) =>
								setType(e.target.value as RouteType)
							}>
							<option value='TOURIST'>TOURIST</option>
							<option value='SPORT'>SPORT</option>
							<option value='MIXED'>MIXED</option>
						</select>
					</div>

					<div className={styles.formRow}>
						<Input
							type='number'
							value={difficulty}
							onChange={(e) =>
								setDifficulty(Number(e.target.value))
							}
						/>

						<Input
							type='number'
							value={lengthMeters}
							onChange={(e) =>
								setLengthMeters(Number(e.target.value))
							}
						/>

						<Input
							type='number'
							value={estimatedTimeMinutes}
							onChange={(e) =>
								setEstimatedTimeMinutes(Number(e.target.value))
							}
						/>
					</div>

					<div className={styles.formGroup}>
						<div className={styles.sectionHeader}>
							<label>Чекпоинты маршрута</label>

							<Button variant='primary' onClick={addCheckpoint}>
								Добавить точку
							</Button>
						</div>

						{checkpoints.map((checkpoint, index) => (
							<div key={index} className={styles.checkpointCard}>
								<h4>Точка #{index + 1}</h4>

								<div className={styles.formRow}>
									<Input
										type='number'
										placeholder='Широта'
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

								<select
									className={styles.select}
									value={checkpoint.landmarkId}
									onChange={(e) =>
										updateCheckpoint(
											index,
											'landmarkId',
											e.target.value
										)
									}>
									<option value=''>
										Без достопримечательности
									</option>

									{landmarks?.content?.map((landmark) => (
										<option
											key={landmark.id}
											value={landmark.id}>
											{landmark.title}
										</option>
									))}
								</select>

								<Button
									variant='secondary'
									onClick={() => removeCheckpoint(index)}>
									Удалить
								</Button>
							</div>
						))}
					</div>

					<div className={styles.formGroup}>
						<label>Город</label>

						<Input
							value={city}
							onChange={(e) => setCity(e.target.value)}
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Теги</label>

						<div className={styles.tagsContainer}>
							{allTags?.map((tag) => (
								<label key={tag.id}>
									<input
										type='checkbox'
										checked={selectedTags.includes(tag.id)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedTags((prev) => [
													...prev,
													tag.id,
												]);
											} else {
												setSelectedTags((prev) =>
													prev.filter(
														(id) => id !== tag.id
													)
												);
											}
										}}
									/>

									{tag.title}
								</label>
							))}
						</div>
					</div>

					<div className={styles.formGroup}>
						<label>Изображения</label>

						<input
							type='file'
							multiple
							accept='image/*'
							onChange={(e) => setImages(e.target.files)}
						/>
					</div>

					<div className={styles.modalActions}>
						<Button variant='secondary' onClick={closeModal}>
							Отмена
						</Button>

						<Button
							variant='primary'
							onClick={
								editingRoute ? handleUpdate : handleCreate
							}>
							{editingRoute ? 'Сохранить' : 'Создать'}
						</Button>
					</div>
				</div>
			</Modal>
		</section>
	);
};

