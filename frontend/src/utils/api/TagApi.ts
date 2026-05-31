import {
	API_URL,
	handleResponse,
	ApiResponse,
	getHeaders,
	API_TAGS_URL,
} from './Api';
import { Tag, TagCreateRequest, TagUpdateRequest } from '../../types/Tags';

/**
 * Удаление тега (только ADMIN)
 */
export const deleteTagApi = async (tagId: string): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API_URL}/${API_TAGS_URL}/${tagId}`, {
			method: 'DELETE',
			headers: getHeaders(true),
		});

		return await handleResponse<string>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'DELETE_TAG_ERROR',
				message: error.message || 'Ошибка удаления тега',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Получение тега по ID
 */
export const getTagApi = async (tagId: string): Promise<ApiResponse<Tag>> => {
	try {
		const response = await fetch(`${API_URL}/${API_TAGS_URL}/${tagId}`, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<Tag>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_TAG_ERROR',
				message: error.message || 'Ошибка получения тега',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Получение всех тегов
 */
export const getAllTagsApi = async (): Promise<ApiResponse<Tag[]>> => {
	try {
		const response = await fetch(`${API_URL}/${API_TAGS_URL}`, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<Tag[]>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_ALL_TAGS_ERROR',
				message: error.message || 'Ошибка получения списка тегов',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Создание нового тега (только ADMIN)
 */
export const createTagApi = async (
	data: TagCreateRequest
): Promise<ApiResponse<Tag>> => {
	try {
		const response = await fetch(`${API_URL}/${API_TAGS_URL}`, {
			method: 'POST',
			headers: getHeaders(true),
			body: JSON.stringify(data),
		});

		return await handleResponse<Tag>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'CREATE_TAG_ERROR',
				message: error.message || 'Ошибка создания тега',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Обновление тега (только ADMIN)
 */
export const updateTagApi = async (
	tagId: string,
	data: TagUpdateRequest
): Promise<ApiResponse<Tag>> => {
	try {
		const response = await fetch(`${API_URL}/${API_TAGS_URL}/${tagId}`, {
			method: 'PUT',
			headers: getHeaders(true),
			body: JSON.stringify(data),
		});

		return await handleResponse<Tag>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPDATE_TAG_ERROR',
				message: error.message || 'Ошибка обновления тега',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};
