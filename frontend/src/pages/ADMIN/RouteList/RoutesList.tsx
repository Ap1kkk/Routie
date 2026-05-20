import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@store';

import {
	fetchAllRoutes,
	fetchRouteById,
	addNewRoute,
	editRoute,
	removeRoute,
	searchRoutesThunk,
	setPage,
	setLimit,
	clearMessages,
} from '../../../services/slices/routeSlice/routeSlice';

import { CreateRouteData, UpdateRouteData } from '../../../types/route';

import './RoutesList.scss';

const initialRoute: CreateRouteData = {
	name: '',
	distance: 0,
	checkpoints: [
		{
			latitude: 56.328,
			longitude: 44.002,
			order: 1,
		},
	],
	tagIds: [],
};

export const RoutesList = () => {
	const dispatch = useDispatch<AppDispatch>();

	const { routes, loading, error, successMessage, page, limit, total } =
		useSelector((state: RootState) => state.routes);

	const [search, setSearch] = useState('');
	const [selectedId, setSelectedId] = useState('');
	const [isEditing, setIsEditing] = useState(false);

	const [form, setForm] = useState<CreateRouteData | UpdateRouteData>(
		initialRoute
	);

	useEffect(() => {
		dispatch(fetchAllRoutes({ page, limit }));
	}, [dispatch, page, limit]);

	const updateField = (key: string, value: string | number | string[]) => {
		setForm((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const resetForm = () => {
		setForm(initialRoute);
		setSelectedId('');
		setIsEditing(false);
	};

	const handleSubmit = async () => {
		try {
			if (isEditing) {
				await dispatch(
					editRoute({
						id: selectedId,
						data: form as UpdateRouteData,
					})
				).unwrap();
			} else {
				await dispatch(addNewRoute(form as CreateRouteData)).unwrap();
			}

			resetForm();
			dispatch(fetchAllRoutes({ page, limit }));
		} catch (err) {
			console.error(err);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('Удалить маршрут?')) return;

		await dispatch(removeRoute(id));
	};

	const startEdit = (route: any) => {
		setSelectedId(route.id);

		setForm({
			name: route.name,
			distance: route.distance,
			tagIds: route.tags?.map((t: any) => t.id) || [],
		});

		setIsEditing(true);

		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	const handleSearch = () => {
		if (!search.trim()) {
			dispatch(
				fetchAllRoutes({
					page: 1,
					limit: 10,
					filters: {},
				})
			);
			return;
		}

		dispatch(searchRoutesThunk(search));
	};

	return (
		<section className='routes-manager'>
			<h1>Управление маршрутами</h1>

			{(successMessage || error) && (
				<div
					className={`message ${error ? 'error' : 'success'}`}
					onClick={() => dispatch(clearMessages())}>
					{successMessage || error}
				</div>
			)}

			<div className='toolbar'>
				<input
					type='text'
					placeholder='Поиск'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<button onClick={handleSearch}>Поиск</button>

				<button
					onClick={() =>
						dispatch(
							fetchAllRoutes({
								page,
								limit,
							})
						)
					}>
					Обновить
				</button>
			</div>

			<div className='editor'>
				<h2>{isEditing ? 'Редактирование' : 'Создание'}</h2>

				<input
					type='text'
					placeholder='Название'
					value={form.name || ''}
					onChange={(e) => updateField('name', e.target.value)}
				/>

				<input
					type='number'
					placeholder='Дистанция'
					value={form.distance || ''}
					onChange={(e) =>
						updateField('distance', Number(e.target.value))
					}
				/>

				<input
					type='text'
					placeholder='Теги через запятую'
					value={form.tagIds?.join(',') || ''}
					onChange={(e) =>
						updateField(
							'tagIds',
							e.target.value.split(',').map((v) => v.trim())
						)
					}
				/>

				<div>
					<button onClick={handleSubmit}>
						{isEditing ? 'Сохранить' : 'Создать'}
					</button>

					{isEditing && <button onClick={resetForm}>Отмена</button>}
				</div>
			</div>

			<div className='routes-grid'>
				{(routes ?? []).map((route) => (
					<div key={route.id} className='route-card'>
						<h3>{route.name}</h3>

						<p>{route.distance} м</p>

						<p>{route.id}</p>

						<div className='actions'>
							<button
								onClick={() =>
									dispatch(fetchRouteById(route.id))
								}>
								Открыть
							</button>

							<button onClick={() => startEdit(route)}>
								Редактировать
							</button>

							<button onClick={() => handleDelete(route.id)}>
								Удалить
							</button>
						</div>
					</div>
				))}
			</div>

			{total > limit && (
				<div className='pagination'>
					<button
						disabled={page === 1}
						onClick={() => dispatch(setPage(page - 1))}>
						←
					</button>

					<span>
						{page} / {Math.ceil(total / limit)}
					</span>

					<button
						disabled={page >= Math.ceil(total / limit)}
						onClick={() => dispatch(setPage(page + 1))}>
						→
					</button>

					<select
						value={limit}
						onChange={(e) =>
							dispatch(setLimit(Number(e.target.value)))
						}>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={20}>20</option>
					</select>
				</div>
			)}

			{loading && <div className='loading'>Загрузка...</div>}
		</section>
	);
};

export default RoutesList;
