import {
	AvatarUser,
	FriendsUser,
	RoutesHistoryUser,
	User,
} from '../../types/user';
import { getHeaders, handleResponse } from './api';

const API_URL = 'http://localhost:3001';

export const getUserAvatar = async (userId: string): Promise<AvatarUser> => {
	try {
		const response = await fetch(
			`${API_URL}/userAvatars?user_id=${userId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);
		const data = await handleResponse<AvatarUser[]>(response);
		return data[0] || { id: '', user_id: userId, avatar: '' };
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки аватара');
	}
};

export const updateUserAvatar = async (
	userId: string,
	avatarUrl: string
): Promise<AvatarUser> => {
	try {
		const response = await fetch(
			`${API_URL}/userAvatars?user_id=${userId}`,
			{
				method: 'PATCH',
				headers: getHeaders(true),
				body: JSON.stringify({ avatar: avatarUrl }),
			}
		);
		return await handleResponse<AvatarUser>(response);
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка обновления аватара');
	}
};

export const getUserFriends = async (userId: string): Promise<FriendsUser> => {
	try {
		const response = await fetch(
			`${API_URL}/userFriends?user_id=${userId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);
		const data = await handleResponse<FriendsUser[]>(response);
		return data[0] || { user_id: userId, friends: [] };
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки друзей');
	}
};

export const addFriend = async (
	userId: string,
	friendId: string
): Promise<any> => {
	try {
		const response = await fetch(
			`${API_URL}/userFriends?user_id=${userId}`,
			{
				method: 'PATCH',
				headers: getHeaders(true),
				body: JSON.stringify({ friendId }),
			}
		);
		return await handleResponse(response);
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка добавления друга');
	}
};

export const getUserRoutesHistory = async (
	userId: string
): Promise<RoutesHistoryUser> => {
	try {
		const response = await fetch(
			`${API_URL}/userRoutesHistory?user_id=${userId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);
		const data = await handleResponse<RoutesHistoryUser[]>(response);
		return data[0] || { user_id: userId, historyRoutes: [] };
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки истории маршрутов');
	}
};

export const addRouteToHistory = async (
	userId: string,
	routeId: string
): Promise<any> => {
	try {
		const response = await fetch(
			`${API_URL}/userRoutesHistory?user_id=${userId}`,
			{
				method: 'PATCH',
				headers: getHeaders(true),
				body: JSON.stringify({ routeId }),
			}
		);
		return await handleResponse(response);
	} catch (error: any) {
		throw new Error(
			error.message || 'Ошибка добавления маршрута в историю'
		);
	}
};
