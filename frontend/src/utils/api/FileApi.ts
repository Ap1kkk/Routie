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
export const downloadFileApi = async (
	fileId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_FILE_URL}/download/${fileId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		if (!response.ok) {
			throw new Error(`Ошибка скачивания файла: ${response.status}`);
		}

		const blob = await response.blob();

		return {
			success: true,
			data: URL.createObjectURL(blob),
			timestamp: new Date().toISOString(),
		};
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'DOWNLOAD_FILE_ERROR',
				message: error.message || 'Ошибка скачивания файла',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const fileApi = {
	upload: uploadFileApi,
	download: downloadFileApi,
	delete: deleteFileApi,
};
