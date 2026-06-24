import {
	API_URL,
	API_ROUTES_URL,
	handleResponse,
	ApiResponse,
	getHeaders,
	API_RECOMMENDATIONS_URL,
} from './Api';
import {
	Route,
	FullRoute,
	RouteCreateRequest,
	RouteUpdateRequest,
	RoutesSearchParams,
	PaginatedRoutes,
	GetRecommendedParams,
	RouteImageUpload,
} from '../../types/Route';

export const deleteRouteApi = async (
	routeId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API_URL}/${API_ROUTES_URL}/${routeId}`, {
			method: 'DELETE',
			headers: getHeaders(true),
		});

		return await handleResponse<string>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'DELETE_ROUTE_ERROR',
				message: error.message || 'Ошибка удаления маршрута',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getRouteApi = async (
	routeId: string
): Promise<ApiResponse<Route>> => {
	try {
		const response = await fetch(`${API_URL}/${API_ROUTES_URL}/${routeId}`, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<Route>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_ROUTE_ERROR',
				message: error.message || 'Ошибка получения маршрута',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const searchRoutesApi = async (
	params?: RoutesSearchParams
): Promise<ApiResponse<PaginatedRoutes>> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.search !== undefined) queryParams.append('search', params.search);
		if (params?.type !== undefined) queryParams.append('type', params.type);
		if (params?.difficultyMin !== undefined)
			queryParams.append('difficultyMin', params.difficultyMin.toString());
		if (params?.difficultyMax !== undefined)
			queryParams.append('difficultyMax', params.difficultyMax.toString());
		if (params?.lengthMin !== undefined)
			queryParams.append('lengthMin', params.lengthMin.toString());
		if (params?.lengthMax !== undefined)
			queryParams.append('lengthMax', params.lengthMax.toString());
		if (params?.estimatedTimeMin !== undefined)
			queryParams.append('estimatedTimeMin', params.estimatedTimeMin.toString());
		if (params?.estimatedTimeMax !== undefined)
			queryParams.append('estimatedTimeMax', params.estimatedTimeMax.toString());
		if (params?.city !== undefined) queryParams.append('city', params.city);
		if (params?.tags !== undefined) queryParams.append('tags', params.tags);
		if (params?.hasAudioGuide !== undefined)
			queryParams.append('hasAudioGuide', params.hasAudioGuide.toString());
		if (params?.favoriteOnly !== undefined)
			queryParams.append('favoriteOnly', params.favoriteOnly.toString());
		if (params?.page !== undefined) queryParams.append('page', params.page.toString());
		if (params?.size !== undefined) queryParams.append('size', params.size.toString());
		if (params?.sort !== undefined) queryParams.append('sort', params.sort);

		const url = `${API_URL}/${API_ROUTES_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<PaginatedRoutes>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'SEARCH_ROUTES_ERROR',
				message: error.message || 'Ошибка поиска маршрутов',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getFullRouteApi = async (
	routeId: string
): Promise<ApiResponse<FullRoute>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_ROUTES_URL}/${routeId}/full`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<FullRoute>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_FULL_ROUTE_ERROR',
				message:
					error.message ||
					'Ошибка получения полной информации о маршруте',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Получение избранных маршрутов */
export const getFavoritesApi = async (params?: {
	page?: number;
	size?: number;
}): Promise<ApiResponse<PaginatedRoutes>> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.page !== undefined)
			queryParams.append('page', params.page.toString());
		if (params?.size !== undefined)
			queryParams.append('size', params.size.toString());

		const url = `${API_URL}/${API_ROUTES_URL}/favorites${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<PaginatedRoutes>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_FAVORITES_ERROR',
				message:
					error.message || 'Ошибка получения избранных маршрутов',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Получение популярных маршрутов */
export const getPopularRoutesApi = async (params?: {
	startDate?: string;
	endDate?: string;
	limit?: number;
}): Promise<ApiResponse<Route[]>> => {
	try {
		const queryParams = new URLSearchParams();

		if (params?.startDate)
			queryParams.append('startDate', params.startDate);
		if (params?.endDate) queryParams.append('endDate', params.endDate);
		if (params?.limit !== undefined)
			queryParams.append('limit', params.limit.toString());

		const url = `${API_URL}/${API_ROUTES_URL}/popular${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<Route[]>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_POPULAR_ROUTES_ERROR',
				message:
					error.message || 'Ошибка получения популярных маршрутов',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getRecommendedRoutesApi = async (
	params?: GetRecommendedParams
): Promise<ApiResponse<PaginatedRoutes>> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.page !== undefined)
			queryParams.append('page', params.page.toString());
		if (params?.size !== undefined)
			queryParams.append('size', params.size.toString());

		const url = `${API_URL}/${API_RECOMMENDATIONS_URL}/personal${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<PaginatedRoutes>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_RECOMMENDED_ROUTES_ERROR',
				message: error.message || 'Ошибка получения рекомендуемых маршрутов',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getDailyRouteApi = async (): Promise<ApiResponse<Route>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_RECOMMENDATIONS_URL}/daily-route`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<Route>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_DAILY_ROUTE_ERROR',
				message: error.message || 'Ошибка получения маршрута дня',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const publishRouteApi = async (
	routeId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_ROUTES_URL}/${routeId}/publish`,
			{
				method: 'PATCH',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<string>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'PUBLISH_ROUTE_ERROR',
				message: error.message || 'Ошибка публикации маршрута',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const uploadRouteImagesApi = async (
	routeId: string,
	files: File
): Promise<ApiResponse<RouteImageUpload[]>> => {
	try {
		const formData = new FormData();
		formData.append('files', files);

		const token = localStorage.getItem('accessToken');
		const headers: HeadersInit = {
			Authorization: token ? `Bearer ${token}` : '',
		};

		const response = await fetch(
			`${API_URL}/${API_ROUTES_URL}/${routeId}/images`,
			{
				method: 'PATCH',
				headers,
				body: formData,
			}
		);

		return await handleResponse<RouteImageUpload[]>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPLOAD_ROUTE_IMAGES_ERROR',
				message:
					error.message || 'Ошибка загрузки изображений маршрута',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const createRouteApi = async (
	data: RouteCreateRequest
): Promise<ApiResponse<Route>> => {
	try {
		const response = await fetch(`${API_URL}/${API_ROUTES_URL}`, {
			method: 'POST',
			headers: getHeaders(true),
			body: JSON.stringify(data),
		});

		const text = await response.text();

		return JSON.parse(text);
	} catch (error: any) {
		console.error(error);

		return {
			success: false,
			error: {
				code: 'CREATE_ROUTE_ERROR',
				message: error.message,
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Toggle избранного (добавить / удалить) */
export const toggleFavoriteApi = async (
	routeId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_ROUTES_URL}/${routeId}/favorite`,
			{
				method: 'POST',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<string>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'TOGGLE_FAVORITE_ERROR',
				message: error.message || 'Ошибка изменения избранного',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Удаление маршрута из избранного */
export const removeFromFavoritesApi = async (
	routeId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_ROUTES_URL}/${routeId}/favorite`,
			{
				method: 'DELETE',           // ← DELETE для удаления
				headers: getHeaders(true),
			}
		);

		return await handleResponse<string>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'REMOVE_FROM_FAVORITES_ERROR',
				message: error.message || 'Ошибка удаления из избранного',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const updateRouteApi = async (
	routeId: string,
	data: RouteUpdateRequest
): Promise<ApiResponse<Route>> => {
	try {
		const response = await fetch(`${API_URL}/${API_ROUTES_URL}/${routeId}`, {
			method: 'PUT',
			headers: getHeaders(true),
			body: JSON.stringify(data),
		});

		return await handleResponse<Route>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPDATE_ROUTE_ERROR',
				message: error.message || 'Ошибка обновления маршрута',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const routeApi = {
	search: searchRoutesApi,
	create: createRouteApi,
	update: updateRouteApi,
	delete: deleteRouteApi,
	getFavorites: getFavoritesApi,
	removeFavorites: removeFromFavoritesApi,
	toggleFavorite: toggleFavoriteApi,
	uploadImages: uploadRouteImagesApi,
	get: getRouteApi,
	getFull: getFullRouteApi,
	getPopular: getPopularRoutesApi,
	getRecommended: getRecommendedRoutesApi,
	getDaily: getDailyRouteApi,
	publish: publishRouteApi,
};
