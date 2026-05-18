import { Tags } from '../../types/tags';
import { getHeaders, handleResponse } from './api';

const API_URL = 'http://localhost:3001';

export const getAllTags = async (): Promise<Tags[]> => {
	try {
		const response = await fetch(`${API_URL}/tags`, {
			method: 'GET',
			headers: getHeaders(),
		});
		return await handleResponse<Tags[]>(response);
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки тегов');
	}
};

export const getUserTags = async (userId: string): Promise<Tags[]> => {
	try {
		const response = await fetch(`${API_URL}/user-tags?user_id=${userId}`, {
			method: 'GET',
			headers: getHeaders(true),
		});
		const data = await handleResponse<any>(response);
		return data.tags || [];
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки тегов пользователя');
	}
};

export const updateUserTags = async (
	userId: string,
	tagIds: string[]
): Promise<any> => {
	try {
		const response = await fetch(`${API_URL}/user-tags?user_id=${userId}`, {
			method: 'PATCH',
			headers: getHeaders(true),
			body: JSON.stringify({ tagIds }),
		});
		return await handleResponse(response);
	} catch (error: any) {
		throw new Error(
			error.message || 'Ошибка обновления тегов пользователя'
		);
	}
};
