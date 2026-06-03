import { AchievementItem } from '../../types/achievments';
import { getHeaders, handleResponse } from './api';

const API_URL = 'http://localhost:3001';

export const getAllAchievements = async (): Promise<AchievementItem[]> => {
	try {
		const response = await fetch(`${API_URL}/achievements`, {
			method: 'GET',
			headers: getHeaders(),
		});
		return await handleResponse<AchievementItem[]>(response);
	} catch (error: any) {
		throw new Error(error.message || 'Ошибка загрузки достижений');
	}
};

export const getUserAchievements = async (
	userId: string
): Promise<AchievementItem[]> => {
	try {
		const response = await fetch(
			`${API_URL}/user-achievements?user_id=${userId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);
		return await handleResponse<AchievementItem[]>(response);
	} catch (error: any) {
		throw new Error(
			error.message || 'Ошибка загрузки достижений пользователя'
		);
	}
};

export const updateAchievementProgress = async (
	achievementId: string,
	progress: number
): Promise<AchievementItem> => {
	try {
		const response = await fetch(
			`${API_URL}/achievements/${achievementId}`,
			{
				method: 'PATCH',
				headers: getHeaders(true),
				body: JSON.stringify({ value: progress }),
			}
		);
		return await handleResponse<AchievementItem>(response);
	} catch (error: any) {
		throw new Error(
			error.message || 'Ошибка обновления прогресса достижения'
		);
	}
};
