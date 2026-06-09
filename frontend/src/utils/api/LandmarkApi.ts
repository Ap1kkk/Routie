import {
	API_LANDMARKS_URL,
	API_URL,
	ApiResponse,
	getHeaders,
	handleResponse,
} from './Api';
import {
	Landmark,
	LandmarkCreateRequest,
	LandmarkImage,
	LandmarksSearchParams,
	LandmarkUpdateRequest,
	PaginatedLandmarks,
} from '../../types/Landmark';

/**
 * Удаление достопримечательности (только ADMIN)
 */
export const deleteLandmarkApi = async (
	landmarkId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_LANDMARKS_URL}/${landmarkId}`,
			{
				method: 'DELETE',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<string>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'DELETE_LANDMARK_ERROR',
				message:
					error.message || 'Ошибка удаления достопримечательности',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Получение достопримечательности по ID
 */
export const getLandmarkApi = async (
	landmarkId: string
): Promise<ApiResponse<Landmark>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_LANDMARKS_URL}/${landmarkId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<Landmark>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_LANDMARK_ERROR',
				message:
					error.message || 'Ошибка получения достопримечательности',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Поиск достопримечательностей по названию
 */
export const searchLandmarksApi = async (
	params?: LandmarksSearchParams
): Promise<ApiResponse<PaginatedLandmarks>> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.title !== undefined)
			queryParams.append('title', params.title);
		if (params?.page !== undefined)
			queryParams.append('page', params.page.toString());
		if (params?.size !== undefined)
			queryParams.append('size', params.size.toString());

		const url = `${API_URL}/${API_LANDMARKS_URL}${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<PaginatedLandmarks>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'SEARCH_LANDMARKS_ERROR',
				message:
					error.message || 'Ошибка поиска достопримечательностей',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Загрузка изображений для достопримечательности (только ADMIN)
 */
export const uploadLandmarkImagesApi = async (
	landmarkId: string,
	files: File[]
): Promise<ApiResponse<LandmarkImage[]>> => {
	try {
		const formData = new FormData();
		files.forEach((file) => {
			formData.append('files', file);
		});

		const token = localStorage.getItem('accessToken');
		const headers: HeadersInit = {
			Authorization: token ? `Bearer ${token}` : '',
		};

		const response = await fetch(
			`${API_URL}/${API_LANDMARKS_URL}/${landmarkId}/images`,
			{
				method: 'PATCH',
				headers,
				body: formData,
			}
		);

		return await handleResponse<LandmarkImage[]>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPLOAD_LANDMARK_IMAGES_ERROR',
				message:
					error.message ||
					'Ошибка загрузки изображений достопримечательности',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Создание достопримечательности (только ADMIN)
 */
export const createLandmarkApi = async (
	data: LandmarkCreateRequest
): Promise<ApiResponse<Landmark>> => {
	try {
		const response = await fetch(`${API_URL}/${API_LANDMARKS_URL}`, {
			method: 'POST',
			headers: getHeaders(true),
			body: JSON.stringify(data),
		});

		return await handleResponse<Landmark>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'CREATE_LANDMARK_ERROR',
				message:
					error.message || 'Ошибка создания достопримечательности',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Обновление достопримечательности (только ADMIN)
 */
export const updateLandmarkApi = async (
	landmarkId: string,
	data: LandmarkUpdateRequest
): Promise<ApiResponse<Landmark>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_LANDMARKS_URL}/${landmarkId}`,
			{
				method: 'PUT',
				headers: getHeaders(true),
				body: JSON.stringify(data),
			}
		);

		return await handleResponse<Landmark>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPDATE_LANDMARK_ERROR',
				message:
					error.message || 'Ошибка обновления достопримечательности',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};
