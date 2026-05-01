import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@store';
import {
	fetchAllRoutes,
	fetchRouteById,
	addNewRoute,
	editRoute,
	removeRoute,
	clearMessages,
	clearCurrentRoute,
	fetchRoutesByTag,
	fetchRoutesByDistanceRange,
	searchRoutesThunk,
	clearRoutes,
	resetRoutesState,
	setPage,
	setLimit,
} from '../../services/slices/routeSlice/routeSlice';
import {
	CreateRouteData,
	UpdateRouteData,
	RouteFilters,
} from '../../types/route';
import { Tags } from '../../types/tags';
import './RoutesList.scss';

export const RoutesList: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		routes,
		currentRoute,
		loading,
		error,
		successMessage,
		total,
		page,
		limit,
	} = useSelector((state: RootState) => state.routes);

	const [selectedRouteId, setSelectedRouteId] = useState<string>(''); // Изменено с number на string
	const [tagId, setTagId] = useState<string>('1'); // Изменено с number на string
	const [minDistance, setMinDistance] = useState<number>(0);
	const [maxDistance, setMaxDistance] = useState<number>(100);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filters, setFilters] = useState<RouteFilters>({});

	const [newRoute, setNewRoute] = useState<CreateRouteData>({
		name: '',
		distance: 0,
		checkpoints: [
			{
				latitude: 56.328,
				longitude: 44.002,
				order: 1,
			},
		],
		tagIds: ['1'],
	});

	const [editData, setEditData] = useState<UpdateRouteData>({
		name: '',
		distance: 0,
		tagIds: [],
	});

	useEffect(() => {
		dispatch(fetchAllRoutes({ page, limit, filters }));
	}, [dispatch, page, limit, filters]);

	const handleFetchAllRoutes = () => {
		dispatch(fetchAllRoutes({ page, limit, filters }));
	};

	const handleFetchRouteById = () => {
		if (selectedRouteId) {
			dispatch(fetchRouteById(selectedRouteId));
		} else {
			alert('Введите ID маршрута');
		}
	};

	const handleSearch = () => {
		if (searchTerm.trim()) {
			dispatch(searchRoutesThunk(searchTerm));
		} else {
			alert('Введите поисковый запрос');
		}
	};

	const handleFilterByTag = () => {
		if (tagId) {
			dispatch(fetchRoutesByTag(tagId));
		} else {
			alert('Введите ID тега');
		}
	};

	const handleFilterByDistance = () => {
		if (minDistance >= 0 && maxDistance > minDistance) {
			dispatch(fetchRoutesByDistanceRange({ minDistance, maxDistance }));
		} else {
			alert('Введите корректный диапазон расстояний');
		}
	};

	const handleCreateRoute = async () => {
		if (!newRoute.name || newRoute.distance <= 0) {
			alert('Заполните все поля');
			return;
		}

		try {
			await dispatch(addNewRoute(newRoute)).unwrap();
			setNewRoute({
				name: '',
				distance: 0,
				checkpoints: [
					{
						latitude: 56.328,
						longitude: 44.002,
						order: 1,
					},
				],
				tagIds: ['1'],
			});
			handleFetchAllRoutes();
		} catch (error) {
			console.error('Create error:', error);
		}
	};

	const handleUpdateRoute = async () => {
		if (!selectedRouteId) {
			alert('Выберите ID маршрута для редактирования');
			return;
		}

		try {
			await dispatch(
				editRoute({
					id: selectedRouteId,
					data: editData,
				})
			).unwrap();
			setEditData({
				name: '',
				distance: 0,
				tagIds: [],
			});
			setSelectedRouteId('');
			handleFetchAllRoutes();
		} catch (error) {
			console.error('Update error:', error);
		}
	};

	const handleDeleteRoute = async (id: string) => {
		if (window.confirm(`Вы уверены, что хотите удалить маршрут ${id}?`)) {
			try {
				await dispatch(removeRoute(id)).unwrap();
				handleFetchAllRoutes();
			} catch (error) {
				console.error('Delete error:', error);
			}
		}
	};

	const handlePageChange = (newPage: number) => {
		dispatch(setPage(newPage));
	};

	const handleLimitChange = (newLimit: number) => {
		dispatch(setLimit(newLimit));
	};

	const handleClearMessages = () => {
		dispatch(clearMessages());
	};

	const handleClearCurrentRoute = () => {
		dispatch(clearCurrentRoute());
	};

	const handleResetAll = () => {
		dispatch(resetRoutesState());
		dispatch(fetchAllRoutes({ page: 1, limit: 10 }));
	};

	if (loading && routes.length === 0) {
		return (
			<div className='loading-container'>
				<div className='spinner'></div>
				<p>Загрузка маршрутов...</p>
			</div>
		);
	}

	return (
		<section className='routes-manager'>
			<h1>Управление маршрутами</h1>

			{(successMessage || error) && (
				<div
					className={`message ${
						successMessage ? 'success' : 'error'
					}`}
					onClick={handleClearMessages}>
					{successMessage || error}
					<span className='close'>×</span>
				</div>
			)}

			<div className='control-panel'>
				<div className='panel-section'>
					<h3>Основные операции</h3>
					<div className='button-group'>
						<button
							onClick={handleFetchAllRoutes}
							className='btn btn-primary'>
							Загрузить все маршруты
						</button>
						<button
							onClick={handleResetAll}
							className='btn btn-secondary'>
							Сбросить
						</button>
					</div>
				</div>

				<div className='panel-section'>
					<h3>Получение маршрута по ID</h3>
					<div className='input-group'>
						<input
							type='text'
							placeholder='ID маршрута (UUID)'
							value={selectedRouteId}
							onChange={(e) => setSelectedRouteId(e.target.value)}
						/>
						<button
							onClick={handleFetchRouteById}
							className='btn btn-info'>
							Найти
						</button>
						<button
							onClick={handleClearCurrentRoute}
							className='btn btn-secondary'>
							Очистить
						</button>
					</div>
				</div>

				<div className='panel-section'>
					<h3>Поиск маршрутов</h3>
					<div className='input-group'>
						<input
							type='text'
							placeholder='Поиск по названию...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyPress={(e) =>
								e.key === 'Enter' && handleSearch()
							}
						/>
						<button
							onClick={handleSearch}
							className='btn btn-primary'>
							Поиск
						</button>
					</div>
				</div>

				<div className='panel-section'>
					<h3>Создание нового маршрута</h3>
					<div className='form-group'>
						<input
							type='text'
							placeholder='Название маршрута'
							value={newRoute.name}
							onChange={(e) =>
								setNewRoute({
									...newRoute,
									name: e.target.value,
								})
							}
						/>
						<input
							type='number'
							placeholder='Дистанция (метры)'
							value={newRoute.distance || ''}
							onChange={(e) =>
								setNewRoute({
									...newRoute,
									distance: Number(e.target.value),
								})
							}
						/>
						<input
							type='text'
							placeholder='ID тегов (через запятую, UUID)'
							value={newRoute.tagIds?.join(',') || ''}
							onChange={(e) =>
								setNewRoute({
									...newRoute,
									tagIds: e.target.value
										.split(',')
										.map((id) => id.trim())
										.filter(Boolean),
								})
							}
						/>
						<button
							onClick={handleCreateRoute}
							className='btn btn-success'>
							Создать маршрут
						</button>
					</div>
				</div>

				<div className='panel-section'>
					<h3>Редактирование маршрута</h3>
					<div className='form-group'>
						<input
							type='text'
							placeholder='ID маршрута для редактирования (UUID)'
							value={selectedRouteId}
							onChange={(e) => setSelectedRouteId(e.target.value)}
						/>
						<input
							type='text'
							placeholder='Новое название'
							value={editData.name || ''}
							onChange={(e) =>
								setEditData({
									...editData,
									name: e.target.value,
								})
							}
						/>
						<input
							type='number'
							placeholder='Новая дистанция'
							value={editData.distance || ''}
							onChange={(e) =>
								setEditData({
									...editData,
									distance: Number(e.target.value),
								})
							}
						/>
						<input
							type='text'
							placeholder='ID тегов (через запятую, UUID)'
							value={editData.tagIds?.join(',') || ''}
							onChange={(e) =>
								setEditData({
									...editData,
									tagIds: e.target.value
										.split(',')
										.map((id) => id.trim())
										.filter(Boolean),
								})
							}
						/>
						<button
							onClick={handleUpdateRoute}
							className='btn btn-warning'>
							Обновить
						</button>
					</div>
				</div>

				<div className='panel-section'>
					<h3>Фильтрация</h3>
					<div className='filter-group'>
						<div className='input-group'>
							<input
								type='text'
								placeholder='ID тега (UUID)'
								value={tagId}
								onChange={(e) => setTagId(e.target.value)}
							/>
							<button
								onClick={handleFilterByTag}
								className='btn btn-info'>
								По тегу
							</button>
						</div>
						<div className='input-group'>
							<input
								type='number'
								placeholder='Мин. расстояние'
								value={minDistance}
								onChange={(e) =>
									setMinDistance(Number(e.target.value))
								}
							/>
							<input
								type='number'
								placeholder='Макс. расстояние'
								value={maxDistance}
								onChange={(e) =>
									setMaxDistance(Number(e.target.value))
								}
							/>
							<button
								onClick={handleFilterByDistance}
								className='btn btn-info'>
								По расстоянию
							</button>
						</div>
					</div>
				</div>
			</div>

			{currentRoute && (
				<div className='current-route'>
					<h2>Текущий маршрут</h2>
					<div className='route-details'>
						<h3>{currentRoute.name}</h3>
						<p>
							<strong>ID:</strong> {currentRoute.id}
						</p>
						<p>
							<strong>Дистанция:</strong> {currentRoute.distance}{' '}
							м
						</p>
						<p>
							<strong>Количество точек:</strong>{' '}
							{currentRoute.checkpoints?.length || 0}
						</p>
						{currentRoute.tags && currentRoute.tags.length > 0 && (
							<p>
								<strong>Теги:</strong>{' '}
								{currentRoute.tags
									.map((t) => t.label)
									.join(', ')}
							</p>
						)}
					</div>
				</div>
			)}

			<div className='routes-list-section'>
				<h2>
					Список маршрутов
					<span className='count'>
						({total || routes?.length || 0})
					</span>
				</h2>

				{routes && routes.length > 0 ? (
					<>
						<div className='routes-grid'>
							{routes.map((route) => (
								<div key={route.id} className='route-card'>
									<div className='route-header'>
										<h3>{route.name}</h3>
										<button
											onClick={() =>
												handleDeleteRoute(route.id)
											}
											className='delete-btn'
											title='Удалить маршрут'>
											×
										</button>
									</div>
									<div className='route-body'>
										<p>
											<strong>ID:</strong> {route.id}
										</p>
										<p>
											<strong>Дистанция:</strong>{' '}
											{route.distance} м
										</p>
										<p>
											<strong>Точки:</strong>{' '}
											{route.checkpoints?.length || 0}
										</p>
										{route.tags &&
											route.tags.length > 0 && (
												<div className='tags'>
													<strong>Теги:</strong>
													<div className='tag-list'>
														{route.tags.map(
															(tag) => (
																<span
																	key={tag.id}
																	className='tag-item'>
																	{tag.label}
																</span>
															)
														)}
													</div>
												</div>
											)}
									</div>
									<div className='route-footer'>
										<button
											onClick={() => {
												setSelectedRouteId(route.id);
												dispatch(
													fetchRouteById(route.id)
												);
											}}
											className='btn-sm btn-info'>
											Просмотр
										</button>
										<button
											onClick={() => {
												setSelectedRouteId(route.id);
												setEditData({
													name: route.name,
													distance: route.distance,
													tagIds:
														route.tags?.map(
															(t) => t.id
														) || [],
												});
												window.scrollTo({
													top: 0,
													behavior: 'smooth',
												});
											}}
											className='btn-sm btn-warning'>
											Редактировать
										</button>
									</div>
								</div>
							))}
						</div>

						{/* Пагинация */}
						{total > limit && (
							<div className='pagination'>
								<button
									onClick={() => handlePageChange(page - 1)}
									disabled={page === 1}
									className='btn-sm'>
									← Предыдущая
								</button>
								<span className='page-info'>
									Страница {page} из{' '}
									{Math.ceil(total / limit)}
								</span>
								<button
									onClick={() => handlePageChange(page + 1)}
									disabled={page >= Math.ceil(total / limit)}
									className='btn-sm'>
									Следующая →
								</button>
								<select
									value={limit}
									onChange={(e) =>
										handleLimitChange(
											Number(e.target.value)
										)
									}
									className='limit-select'>
									<option value={5}>5 на странице</option>
									<option value={10}>10 на странице</option>
									<option value={20}>20 на странице</option>
									<option value={50}>50 на странице</option>
								</select>
							</div>
						)}
					</>
				) : (
					<div className='empty-state'>
						<p>Нет доступных маршрутов</p>
						<button
							onClick={handleFetchAllRoutes}
							className='btn btn-primary'>
							Загрузить маршруты
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export default RoutesList;
