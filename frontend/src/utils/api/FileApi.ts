import {
	API_URL,
	handleResponse,
	ApiResponse,
	getHeaders,
	API_FILE_URL,
} from './Api';
import { UploadedFile } from '../../types/File';

/**
 * Удаление файла
 */
export const deleteFileApi = async (
	fileId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API_URL}/${API_FILE_URL}/${fileId}`, {
			method: 'DELETE',
			headers: getHeaders(true),
		});

		return await handleResponse<string>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'DELETE_FILE_ERROR',
				message: error.message || 'Ошибка удаления файла',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Загрузка файла
 */
export const uploadFileApi = async (
	file: File
): Promise<ApiResponse<UploadedFile>> => {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const token = localStorage.getItem('accessToken');
		const headers: HeadersInit = {
			Authorization: token ? `Bearer ${token}` : '',
		};

		const response = await fetch(`${API_URL}/${API_FILE_URL}/upload`, {
			method: 'POST',
			headers,
			body: formData,
		});

		return await handleResponse<UploadedFile>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPLOAD_FILE_ERROR',
				message: error.message || 'Ошибка загрузки файла',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Скачивание файла
 */
export const downloadFileApi = async (fileId: string): Promise<string> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_FILE_URL}/download/${fileId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		if (!response.ok) {
			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const errorData: ApiResponse = await response.json();
				throw new Error(
					errorData.error?.message || 'Ошибка при скачивании файла'
				);
			}
			throw new Error(`Ошибка сервера: ${response.status}`);
		}

		const text = await response.text();
		return text;
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка при скачивании файла');
	}
};
