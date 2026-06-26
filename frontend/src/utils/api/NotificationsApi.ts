import {
	API_URL,
	API_NOTIFICATIONS_URL,
	handleResponse,
	ApiResponse,
	getHeaders,
} from './Api';
import { PaginatedNotifications, Notification } from '../../types/Notification';

/** Получить все уведомления */
export const getNotificationsApi = async (params?: {
	page?: number;
	size?: number;
}): Promise<ApiResponse<PaginatedNotifications>> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.page !== undefined)
			queryParams.append('page', params.page.toString());
		if (params?.size !== undefined)
			queryParams.append('size', params.size.toString());

		const url = `${API_URL}/${API_NOTIFICATIONS_URL}${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<PaginatedNotifications>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_NOTIFICATIONS_ERROR',
				message: error.message || 'Ошибка получения уведомлений',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Получить непрочитанные уведомления */
export const getUnreadNotificationsApi = async (params?: {
	page?: number;
	size?: number;
}): Promise<ApiResponse<PaginatedNotifications>> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.page !== undefined)
			queryParams.append('page', (params.page || 0).toString());
		if (params?.size !== undefined)
			queryParams.append('size', (params.size || 20).toString());

		const url = `${API_URL}/${API_NOTIFICATIONS_URL}/unread${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<PaginatedNotifications>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_UNREAD_NOTIFICATIONS_ERROR',
				message:
					error.message ||
					'Ошибка получения непрочитанных уведомлений',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Получить количество непрочитанных */
export const getUnreadCountApi = async (): Promise<ApiResponse<number>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_NOTIFICATIONS_URL}/unread-count`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<number>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_UNREAD_COUNT_ERROR',
				message:
					error.message ||
					'Ошибка получения количества непрочитанных',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Пометить уведомление как прочитанное */
export const markAsReadApi = async (
	notificationId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_NOTIFICATIONS_URL}/${notificationId}/read`,
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
				code: 'MARK_AS_READ_ERROR',
				message:
					error.message ||
					'Ошибка отметки уведомления как прочитанного',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Пометить все уведомления как прочитанные */
export const markAllAsReadApi = async (): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_NOTIFICATIONS_URL}/read-all`,
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
				code: 'MARK_ALL_AS_READ_ERROR',
				message:
					error.message ||
					'Ошибка отметки всех уведомлений как прочитанных',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};
