import {
	CreateRouteData,
	Route,
	RouteFilters,
	RoutesResponse,
	UpdateRouteData,
} from '../../types/route';
import { getHeaders, handleResponse } from './api';

const API_URL = 'http://localhost:3001';

// Получение всех маршрутов с фильтрацией и пагинацией
export const getAllRoutes = async (
	filters?: RouteFilters,
	page: number = 1,
	limit: number = 10
): Promise<RoutesResponse> => {
	try {
		const params = new URLSearchParams();
		params.append('page', page.toString());
		params.append('limit', limit.toString());

		if (filters?.name) params.append('name', filters.name);
		if (filters?.search) params.append('search', filters.search);
		if (filters?.minDistance)
			params.append('minDistance', filters.minDistance.toString());
		if (filters?.maxDistance)
			params.append('maxDistance', filters.maxDistance.toString());
		if (filters?.tagIds && filters.tagIds.length > 0) {
			filters.tagIds.forEach((tagId) =>
				params.append('tagIds', tagId.toString())
			);
		}

		const response = await fetch(`${API_URL}/routes?${params.toString()}`, {
			method: 'GET',
			headers: getHeaders(),
		});
		return await handleResponse<RoutesResponse>(response);
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки маршрутов');
	}
};

// Получение маршрута по ID (UUID)
export const getRouteById = async (id: string): Promise<Route> => {
	try {
		const response = await fetch(`${API_URL}/routes/${id}`, {
			method: 'GET',
			headers: getHeaders(),
		});
		return await handleResponse<Route>(response);
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки маршрута');
	}
};

// Создание маршрута
export const createRoute = async (data: CreateRouteData): Promise<Route> => {
	try {
		const response = await fetch(`${API_URL}/routes`, {
			method: 'POST',
			headers: getHeaders(true), // С аутентификацией
			body: JSON.stringify(data),
		});
		return await handleResponse<Route>(response);
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка создания маршрута');
	}
};

// Обновление маршрута
export const updateRoute = async (
	id: string,
	data: UpdateRouteData
): Promise<Route> => {
	try {
		const response = await fetch(`${API_URL}/routes/${id}`, {
			method: 'PATCH',
			headers: getHeaders(true), // С аутентификацией
			body: JSON.stringify(data),
		});
		return await handleResponse<Route>(response);
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка обновления маршрута');
	}
};

// Удаление маршрута
export const deleteRoute = async (
	id: string
): Promise<{ success: boolean; message: string }> => {
	try {
		const response = await fetch(`${API_URL}/routes/${id}`, {
			method: 'DELETE',
			headers: getHeaders(true), // С аутентификацией
		});

		await handleResponse(response);
		return {
			success: true,
			message: 'Маршрут успешно удален',
		};
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка удаления маршрута');
	}
};

// Получение маршрутов по тегу
export const getRoutesByTag = async (tagId: string): Promise<Route[]> => {
	try {
		const response = await fetch(`${API_URL}/routes?tagIds=${tagId}`, {
			method: 'GET',
			headers: getHeaders(),
		});
		const result = await handleResponse<RoutesResponse>(response);
		return result.data;
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки маршрутов по тегу');
	}
};

// Получение маршрутов по диапазону расстояния
export const getRoutesByDistanceRange = async (
	minDistance: number,
	maxDistance: number
): Promise<Route[]> => {
	try {
		const response = await fetch(
			`${API_URL}/routes?minDistance=${minDistance}&maxDistance=${maxDistance}`,
			{
				method: 'GET',
				headers: getHeaders(),
			}
		);
		const result = await handleResponse<RoutesResponse>(response);
		return result.data;
	} catch (error: any) {
		throw new Error(
			error.message || 'Ошибка загрузки маршрутов по расстоянию'
		);
	}
};

// Поиск маршрутов по названию
export const searchRoutes = async (searchTerm: string): Promise<Route[]> => {
	try {
		const response = await fetch(
			`${API_URL}/routes?search=${encodeURIComponent(searchTerm)}`,
			{
				method: 'GET',
				headers: getHeaders(),
			}
		);
		const result = await handleResponse<RoutesResponse>(response);
		return result.data;
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка поиска маршрутов');
	}
};

// Получение маршрутов с пагинацией (улучшенная версия)
export const getRoutesPaginated = async (
	page: number = 1,
	limit: number = 10,
	filters?: RouteFilters
): Promise<RoutesResponse> => {
	try {
		const params = new URLSearchParams();
		params.append('page', page.toString());
		params.append('limit', limit.toString());

		if (filters?.name) params.append('name', filters.name);
		if (filters?.search) params.append('search', filters.search);
		if (filters?.minDistance)
			params.append('minDistance', filters.minDistance.toString());
		if (filters?.maxDistance)
			params.append('maxDistance', filters.maxDistance.toString());
		if (filters?.tagIds && filters.tagIds.length > 0) {
			filters.tagIds.forEach((tagId) =>
				params.append('tagIds', tagId.toString())
			);
		}

		const response = await fetch(`${API_URL}/routes?${params.toString()}`, {
			method: 'GET',
			headers: getHeaders(),
		});
		return await handleResponse<RoutesResponse>(response);
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки маршрутов');
	}
};

// Получение количества маршрутов
export const getRoutesCount = async (
	filters?: RouteFilters
): Promise<number> => {
	try {
		const params = new URLSearchParams();

		if (filters?.name) params.append('name', filters.name);
		if (filters?.search) params.append('search', filters.search);
		if (filters?.minDistance)
			params.append('minDistance', filters.minDistance.toString());
		if (filters?.maxDistance)
			params.append('maxDistance', filters.maxDistance.toString());
		if (filters?.tagIds && filters.tagIds.length > 0) {
			filters.tagIds.forEach((tagId) =>
				params.append('tagIds', tagId.toString())
			);
		}

		const response = await fetch(
			`${API_URL}/routes/count?${params.toString()}`,
			{
				method: 'GET',
				headers: getHeaders(),
			}
		);
		const result = await handleResponse<{ count: number }>(response);
		return result.count;
	} catch (error: any) {
		throw new Error(
			error.message || 'Ошибка получения количества маршрутов'
		);
	}
};

// Получение популярных маршрутов
export const getPopularRoutes = async (limit: number = 5): Promise<Route[]> => {
	try {
		const response = await fetch(
			`${API_URL}/routes/popular?limit=${limit}`,
			{
				method: 'GET',
				headers: getHeaders(),
			}
		);
		const result = await handleResponse<RoutesResponse>(response);
		return result.data;
	} catch (error: any) {
		throw new Error(
			error.message || 'Ошибка загрузки популярных маршрутов'
		);
	}
};
