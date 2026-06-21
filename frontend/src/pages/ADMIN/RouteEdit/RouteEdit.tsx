import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';
import { Route, RouteType } from '../../../types/Route';
import {
	createNewRoute,
	fetchRoute,
	routeDelete,
	routeImagesUpload,
	routePublish,
	routeUpdate,
	searchRoutes,
} from '../../../services/slices/routeSlice/routeSlice';
import {
	clearDraft,
	setDraft,
	setModalOpen,
} from '../../../services/slices/routeDraftSlice/routeDraftSlice';
import { fetchAllTags } from '../../../services/slices/tagsSlice/tagsSlice';
import { searchLandmarks } from '../../../services/slices/landmarkSlice/landmarkSlice';
import { Button, Input, Modal, Select, Tag, Textarea } from '@ui';

import styles from './RouteEdit.module.scss';

export const RouteEdit = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { searchResults, isLoading } = useSelector((state) => state.routes);

	const { allTags } = useSelector((state) => state.tags);

	const [editingRoute, setEditingRoute] = useState<Route | null>(null);
	const [images, setImages] = useState<FileList | null>(null);
	const [routeSearch, setRouteSearch] = useState('');

	const draft = useSelector((state) => state.routeDraft);

	const loadRoutes = () =>
		dispatch(
			searchRoutes({
				page: 0,
				size: 100,
			})
		);

	useEffect(() => {
		loadRoutes();
		dispatch(fetchAllTags());
		dispatch(
			searchLandmarks({
				page: 0,
				size: 100,
			})
		);
	}, []);

	const openCreateModal = () => {
		dispatch(clearDraft());
		dispatch(setModalOpen(true));
	};

	const closeModal = () => {
		dispatch(clearDraft());
		dispatch(setModalOpen(false));
	};

	const filteredRoutes = routeSearch.trim()
		? searchResults?.content.filter((route) =>
				route.title.toLowerCase().includes(routeSearch.toLowerCase())
		  ) ?? []
		: searchResults?.content ?? [];

	const preparedCheckpoints = draft.checkpoints.map((cp, index) => ({
		latitude: cp.latitude,
		longitude: cp.longitude,
		landmarkId: cp.landmarkId,
		sortOrder: index,
	}));

	const handleCreate = async () => {
		const result = await dispatch(
			createNewRoute({
				title: draft.title,
				description: draft.description,
				type: draft.type,
				difficulty: draft.difficulty,
				lengthMeters: draft.lengthMeters,
				estimatedTimeMinutes:
				draft.estimatedTimeMinutes,
				city: draft.city,
				tagIds: draft.selectedTags,
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

		dispatch(clearDraft());
		dispatch(setModalOpen(false));
		loadRoutes();
	};

	const handleUpdate = async () => {
		if (!editingRoute) return;

		await dispatch(
			routeUpdate({
				routeId: editingRoute.id,
				data: {
					title: draft.title,
					description: draft.description,
					type: draft.type,
					difficulty: draft.difficulty,
					lengthMeters: draft.lengthMeters,
					estimatedTimeMinutes: draft.estimatedTimeMinutes,
					city: draft.city,
					tagIds: draft.selectedTags,
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

		dispatch(clearDraft());
		dispatch(setModalOpen(false));
		loadRoutes();
	};

	const handleDelete = async (routeId: string) => {
		await dispatch(routeDelete(routeId));
		loadRoutes();
	};

	const handlePublish = async (routeId: string) => {
		await dispatch(routePublish(routeId));
		loadRoutes();
	};

	const startEdit = async (route: Route) => {
		const result = await dispatch(fetchRoute(route.id));
		if (!fetchRoute.fulfilled.match(result)) return;
		const fullRoute = result.payload;

		setEditingRoute(route);

		dispatch(
			setDraft({
				title: fullRoute.title,
				description: fullRoute.description,
				type: fullRoute.type as RouteType,
				difficulty: fullRoute.difficulty,
				lengthMeters: fullRoute.lengthMeters,
				estimatedTimeMinutes: fullRoute.estimatedTimeMinutes,
				city: fullRoute.city,

				selectedTags: fullRoute.tags.map((tag) => tag.id),

				checkpoints: fullRoute.checkpoints.map((cp) => ({
					latitude: cp.latitude,
					longitude: cp.longitude,
					landmarkId: cp.landmark?.id ?? '',
					landmarkSearch: cp.landmark?.title ?? '',
				})),
			})
		);

		dispatch(setModalOpen(true));
	};

	return (
		<section className={styles.section}>
			<h3 className={styles.title}>Управление маршрутами</h3>

			<div className={styles.headerActions}>
				<Button
					variant='secondary'
					onClick={() => navigate('/admin')}
				>
					Назад
				</Button>

				<Input
					className={styles.searchInput}
					placeholder='Поиск маршрута...'
					value={routeSearch}
					onChange={(e) => setRouteSearch(e.target.value)}
				/>

				<Button
					variant='primary'
					onClick={openCreateModal}
				>
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
					{filteredRoutes.map((route) => (
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
								<span
									className={
										route.isActive
											? styles.statusPublished
											: styles.statusDraft
									}>
									{route.isActive ? '✅' : '❌'}
								</span>
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
				isOpen={draft.isModalOpen}
				onClose={closeModal}
				className={styles.modal}>
				<div className={styles.modalContent}>
					<h3 className={styles.modalTitle}>
						{editingRoute
							? 'Редактирование маршрута'
							: 'Создание маршрута'}
					</h3>

					<Input
						label={'Название'}
						value={draft.title}
						inputPadding={'5px 10px'}
						onChange={(e) =>
							dispatch(
								setDraft({
									title: e.target.value,
								})
							)
						}
					/>

					<Textarea
						label={'Описание'}
						value={draft.description}
						className={styles.textareaForm}
						inputPadding={'5px 10px'}
						onChange={(e) =>
							dispatch(
								setDraft({
									description: e.target.value,
								})
							)
						}
					/>

					<Select
						label='Тип маршрута'
						value={draft.type}
						onChange={(value) =>
							dispatch(
								setDraft({
									type: value as RouteType,
								})
							)
						}
						options={[
							{ value: 'TOURIST', label: 'TOURIST' },
							{ value: 'SPORT', label: 'SPORT' },
							{ value: 'MIXED', label: 'MIXED' },
						]}
					/>

					<div className={styles.formRow}>
						<Input
							label={'Сложность'}
							type='number'
							value={draft.difficulty}
							inputPadding={'5px 10px'}
							onChange={(e) =>
								dispatch(
									setDraft({
										difficulty: Number(e.target.value),
									})
								)
							}
						/>

						<Input
							label={'Длина'}
							type='number'
							value={draft.lengthMeters}
							inputPadding={'5px 10px'}
							onChange={(e) =>
								dispatch(
									setDraft({
										lengthMeters: Number(e.target.value),
									})
								)
							}
						/>

						<Input
							label={'Время в минутах'}
							type='number'
							value={draft.estimatedTimeMinutes}
							inputPadding={'5px 10px'}
							onChange={(e) =>
								dispatch(
									setDraft({
										estimatedTimeMinutes: Number(
											e.target.value
										),
									})
								)
							}
						/>
					</div>

					<div className={styles.formGroup}>
						<div className={styles.sectionHeader}>
							<label>Чекпоинты маршрута</label>

							<Button
								variant='primary'
								onClick={() =>
									navigate('/admin/routes-edit/checkpoints')
								}>
								Редактировать точки ({draft.checkpoints.length})
							</Button>
						</div>
					</div>

					<Input
						label={'Город'}
						value={draft.city}
						inputPadding={'5px 10px'}
						onChange={(e) =>
							dispatch(
								setDraft({
									city: e.target.value,
								})
							)
						}
					/>

					<div>
						<label>Теги</label>
						{allTags != null ? (
							<Tag
								items={allTags.map((tag) => ({
									id: tag.id,
									label: tag.title,
								}))}
								wrap={false}
								selectedIds={draft.selectedTags}
								onTagClick={(id) => {
									if (!id) return;

									const tagId = String(id);

									dispatch(
										setDraft({
											selectedTags:
												draft.selectedTags.includes(
													tagId
												)
													? draft.selectedTags.filter(
															(x) => x !== tagId
													  )
													: [
															...draft.selectedTags,
															tagId,
													  ],
										})
									);
								}}
							/>
						) : (
							<span>Нет тегов</span>
						)}
					</div>

					<Input
						label={'Изображения'}
						type='file'
						multiple
						accept='image/*'
						inputPadding={'5px 10px'}
						onChange={(e) => setImages(e.target.files)}
					/>

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
