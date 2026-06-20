import {
	API_URL,
	handleResponse,
	ApiResponse,
	getHeaders,
	API_AUDIO_GUIDES_URL,
} from './Api';
import {
	AudioGuide,
	AudioGuideCreateRequest,
	AudioGuideFile,
	AudioGuidesSearchParams,
	AudioGuideUpdateRequest,
	PaginatedAudioGuides,
} from '../../types/AudioGuide';

/**
 * Удаление аудиогида (только ADMIN)
 */
export const deleteAudioGuideApi = async (
	audioGuideId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_AUDIO_GUIDES_URL}/${audioGuideId}`,
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
				code: 'DELETE_AUDIO_GUIDE_ERROR',
				message: error.message || 'Ошибка удаления аудиогида',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Получение аудиогида по ID
 */
export const getAudioGuideApi = async (
	audioGuideId: string
): Promise<ApiResponse<AudioGuide>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_AUDIO_GUIDES_URL}/${audioGuideId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<AudioGuide>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_AUDIO_GUIDE_ERROR',
				message: error.message || 'Ошибка получения аудиогида',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Поиск аудиогидов по названию
 */
export const searchAudioGuidesApi = async (
	params?: AudioGuidesSearchParams
): Promise<ApiResponse<PaginatedAudioGuides>> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.title !== undefined)
			queryParams.append('title', params.title);
		if (params?.page !== undefined)
			queryParams.append('page', params.page.toString());
		if (params?.size !== undefined)
			queryParams.append('size', params.size.toString());

		const url = `${API_URL}/${API_AUDIO_GUIDES_URL}${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<PaginatedAudioGuides>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'SEARCH_AUDIO_GUIDES_ERROR',
				message: error.message || 'Ошибка поиска аудиогидов',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Загрузка аудиофайла для аудиогида (только ADMIN)
 */
export const uploadAudioGuideFileApi = async (
	audioGuideId: string,
	file: File
): Promise<ApiResponse<AudioGuideFile>> => {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const token = localStorage.getItem('accessToken');
		const headers: HeadersInit = {
			Authorization: token ? `Bearer ${token}` : '',
		};

		const response = await fetch(
			`${API_URL}/${API_AUDIO_GUIDES_URL}/${audioGuideId}/file`,
			{
				method: 'PATCH',
				headers,
				body: formData,
			}
		);

		return await handleResponse<AudioGuideFile>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPLOAD_AUDIO_GUIDE_FILE_ERROR',
				message: error.message || 'Ошибка загрузки аудиофайла',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Создание аудиогида (только ADMIN)
 */
export const createAudioGuideApi = async (
	data: AudioGuideCreateRequest
): Promise<ApiResponse<AudioGuide>> => {
	try {
		const response = await fetch(`${API_URL}/${API_AUDIO_GUIDES_URL}`, {
			method: 'POST',
			headers: getHeaders(true),
			body: JSON.stringify(data),
		});

		return await handleResponse<AudioGuide>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'CREATE_AUDIO_GUIDE_ERROR',
				message: error.message || 'Ошибка создания аудиогида',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Обновление аудиогида (только ADMIN)
 */
export const updateAudioGuideApi = async (
	audioGuideId: string,
	data: AudioGuideUpdateRequest
): Promise<ApiResponse<AudioGuide>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_AUDIO_GUIDES_URL}/${audioGuideId}`,
			{
				method: 'PUT',
				headers: getHeaders(true),
				body: JSON.stringify(data),
			}
		);

		return await handleResponse<AudioGuide>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPDATE_AUDIO_GUIDE_ERROR',
				message: error.message || 'Ошибка обновления аудиогида',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};
