import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { routeApi } from '../../../utils/api/RoutesApi';
import { tagApi } from '../../../utils/api/TagApi';
import { landmarkApi } from '../../../utils/api/LandmarkApi';
import { clearDraft, setDraft, setModalOpen, } from '../../../services/slices/routeDraftSlice/routeDraftSlice';
import { Button, Input, Modal, Select, Tag, Textarea } from '@ui';
import { Route, RouteType } from '../../../types/Route';
import { Tags } from '../../../types/Tags';
import { Landmark } from '../../../types/Landmark';

import styles from './RouteEdit.module.scss';

export const RouteEdit = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [editingRoute, setEditingRoute] = useState<Route | null>(null);
	const [images, setImages] = useState<FileList | null>(null);
	const [routeSearch, setRouteSearch] = useState('');
	const [allTags, setAllTags] = useState<Tags[]>([]);
	const [landmarks, setLandmarks] = useState<Landmark[]>([]);

	const draft = useSelector((state) => state.routeDraft);

	const {
		items: routes,
		loading: isLoading,
		loaderRef,
		reset,
	} = useInfiniteScroll<Route>({
		loadPage: async (page, size) => {
			const response = await routeApi.search({
				page,
				size,
			});

			if (!response.success || !response.data) {
				return {
					content: [],
					totalPages: 0,
				};
			}

			return response.data;
		},
		pageSize: 10,
	});

	useEffect(() => {
		loadInitialData();
	}, []);

	const loadInitialData = async () => {
		const [tagsResponse, landmarksResponse] = await Promise.all([
			tagApi.getAll(),
			landmarkApi.search({
				page: 0,
				size: 15,
			}),
		]);

		if (tagsResponse.success && tagsResponse.data) {
			setAllTags(tagsResponse.data);
		}

		if (landmarksResponse.success && landmarksResponse.data) {
			setLandmarks(landmarksResponse.data.content);
		}
	};

	const filteredRoutes = routeSearch.trim()
		? routes.filter((route) =>
				route.title.toLowerCase().includes(routeSearch.toLowerCase())
		  )
		: routes;

	const openCreateModal = () => {
		dispatch(clearDraft());
		dispatch(
			setDraft({
				editingRouteId: null
			})
		);
		dispatch(setModalOpen(true));
	};

	const closeModal = () => {
		dispatch(clearDraft());
		dispatch(setModalOpen(false));
		setEditingRoute(null);
	};

	const preparedCheckpoints = draft.checkpoints.map((cp, index) => ({
		latitude: cp.latitude,
		longitude: cp.longitude,
		landmarkId: cp.landmarkId,
		sortOrder: index,
	}));

	const handleCreate = async () => {
		const result = await routeApi.create({
			title: draft.title,
			description: draft.description,
			type: draft.type,
			difficulty: draft.difficulty,
			lengthMeters: draft.lengthMeters,
			estimatedTimeMinutes: draft.estimatedTimeMinutes,
			city: draft.city,
			tagIds: draft.selectedTags,
			checkpoints: preparedCheckpoints,
		});

		if (!result.success || !result.data) return;

		if (images) {
			for (const file of Array.from(images)) {
				await routeApi.uploadImages(result.data.id, file);
			}
		}

		setEditingRoute(null);
		dispatch(clearDraft());
		dispatch(setModalOpen(false));
		reset();
	};

	const handleUpdate = async () => {
		if (!draft.editingRouteId) return;

		await routeApi.update(draft.editingRouteId, {
			title: draft.title,
			description: draft.description,
			type: draft.type,
			difficulty: draft.difficulty,
			lengthMeters: draft.lengthMeters,
			estimatedTimeMinutes: draft.estimatedTimeMinutes,
			city: draft.city,
			tagIds: draft.selectedTags,
			checkpoints: preparedCheckpoints,
		});

		if (images) {
			for (const file of Array.from(images)) {
				await routeApi.uploadImages(draft.editingRouteId, file);
			}
		}

		dispatch(clearDraft());
		dispatch(setModalOpen(false));
		reset();
	};

	const handleDelete = async (routeId: string) => {
		const response = await routeApi.delete(routeId);
		if (!response.success) return;
		reset();
	};

	const handlePublish = async (routeId: string) => {
		const response = await routeApi.publish(routeId);
		if (!response.success) return;
		reset();
	};

	const startEdit = async (route: Route) => {
		const result = await routeApi.getFull(route.id);
		if (!result.success || !result.data) return;
		const fullRoute = result.data;

		setEditingRoute(route);

		dispatch(
			setDraft({
				editingRouteId: route.id,
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
				<Button variant='secondary' onClick={() => navigate('/admin')}>
					Назад
				</Button>

				<Input
					className={styles.searchInput}
					placeholder='Поиск маршрута...'
					value={routeSearch}
					onChange={(e) => setRouteSearch(e.target.value)}
				/>

				<Button variant='primary' onClick={openCreateModal}>
					Создать маршрут
				</Button>
			</div>

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

			<div ref={loaderRef} className={styles.loader}>
				{isLoading && <p>Загрузка...</p>}
			</div>

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
							showNumberArrows={false}
							readOnly
						/>

						<Input
							label={'Время в минутах'}
							type='number'
							value={draft.estimatedTimeMinutes}
							inputPadding={'5px 10px'}
							showNumberArrows={false}
							readOnly
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
								wrap={true}
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
								draft.editingRouteId
									? handleUpdate
									: handleCreate
							}
							children={
								draft.editingRouteId ? 'Сохранить' : 'Создать'
							}
						/>
					</div>
				</div>
			</Modal>
		</section>
	);
};
