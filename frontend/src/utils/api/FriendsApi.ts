import {
	API_URL,
	handleResponse,
	ApiResponse,
	getHeaders,
	API_FRIENDS_URL,
} from './Api';
import { FriendsSearchParams, PaginatedFriends } from '../../types/Friends';

/**
 * Удалить из друзей
 */
export const removeFriendApi = async (
	friendId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_FRIENDS_URL}/${friendId}`,
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
				code: 'REMOVE_FRIEND_ERROR',
				message: error.message || 'Ошибка удаления из друзей',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Получение списка друзей и запросов
 */
export const getFriendsApi = async (
	params?: FriendsSearchParams
): Promise<ApiResponse<PaginatedFriends>> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.page !== undefined)
			queryParams.append('page', params.page.toString());
		if (params?.size !== undefined)
			queryParams.append('size', params.size.toString());
		if (params?.sort !== undefined) queryParams.append('sort', params.sort);
		if (params?.search !== undefined)
			queryParams.append('search', params.search);
		if (params?.status !== undefined)
			queryParams.append('status', params.status);

		const url = `${API_URL}/${API_FRIENDS_URL}${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<PaginatedFriends>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_FRIENDS_ERROR',
				message: error.message || 'Ошибка получения списка друзей',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Отправить запрос в друзья
 */
export const sendFriendRequestApi = async (
	friendId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_FRIENDS_URL}/request/${friendId}`,
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
				code: 'SEND_FRIEND_REQUEST_ERROR',
				message: error.message || 'Ошибка отправки запроса в друзья',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Отклонить запрос в друзья
 */
export const rejectFriendRequestApi = async (
	friendshipId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_FRIENDS_URL}/reject/${friendshipId}`,
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
				code: 'REJECT_FRIEND_REQUEST_ERROR',
				message: error.message || 'Ошибка отклонения запроса в друзья',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/**
 * Принять запрос в друзья
 */
export const acceptFriendRequestApi = async (
	friendshipId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_FRIENDS_URL}/accept/${friendshipId}`,
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
				code: 'ACCEPT_FRIEND_REQUEST_ERROR',
				message: error.message || 'Ошибка принятия запроса в друзья',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};
