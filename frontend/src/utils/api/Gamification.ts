import {
	AchievementsResponse,
	AllAchievementsResponse,
	LeaderboardResponse,
	XpHistoryResponse,
} from 'src/types/Gamification';
import {
	API_URL,
	handleResponse,
	ApiResponse,
	getHeaders,
	API_GAMIFICATION_URL,
} from './Api';
import { fetchWithAuth } from './AuthApi';

export const getAchievementsApi = async (): Promise<
	ApiResponse<AchievementsResponse>
> => {
	try {
		const response = await fetchWithAuth(
			`${API_URL}/${API_GAMIFICATION_URL}/achievements`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);
		return await handleResponse<AchievementsResponse>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_ACHIEVEMENTS_ERROR',
				message: error.message || 'Ошибка получения достижений',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getAllAchievementsApi = async (): Promise<
	ApiResponse<AllAchievementsResponse>
> => {
	try {
		const response = await fetchWithAuth(
			`${API_URL}/${API_GAMIFICATION_URL}/achievements/all`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);
		return await handleResponse<AllAchievementsResponse>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_ALL_ACHIEVEMENTS_ERROR',
				message: error.message || 'Ошибка получения всех достижений',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getXpHistoryApi = async (params?: {
	page?: number;
	size?: number;
	sort?: string;
}): Promise<ApiResponse<XpHistoryResponse>> => {
	try {
		const query = new URLSearchParams();
		if (params?.page !== undefined)
			query.append('page', params.page.toString());
		if (params?.size !== undefined)
			query.append('size', params.size.toString());
		if (params?.sort) query.append('sort', params.sort);

		const url = `${API_URL}/${API_GAMIFICATION_URL}/xp-history${
			query.toString() ? `?${query.toString()}` : ''
		}`;

		const response = await fetchWithAuth(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<XpHistoryResponse>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_XP_HISTORY_ERROR',
				message: error.message || 'Ошибка получения истории XP',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getLeaderboardApi = async (
	period: 'WEEK' | 'MONTH' | 'SEASON',
	limit = 100
): Promise<ApiResponse<LeaderboardResponse>> => {
	try {
		const query = new URLSearchParams({ period, limit: limit.toString() });
		const response = await fetchWithAuth(
			`${API_URL}/${API_GAMIFICATION_URL}/leaderboard?${query.toString()}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);
		return await handleResponse<LeaderboardResponse>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_LEADERBOARD_ERROR',
				message: error.message || 'Ошибка получения лидерборда',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getFriendsLeaderboardApi = async (
	period: 'WEEK' | 'MONTH' | 'SEASON',
	limit: number = 50,
	sort:
		| 'TOTAL_XP'
		| 'TOTAL_DISTANCE_METERS'
		| 'TOTAL_ROUTES_COMPLETED' = 'TOTAL_XP'
): Promise<ApiResponse<LeaderboardResponse>> => {
	try {
		const query = new URLSearchParams({
			period,
			limit: limit.toString(),
			sort,
		});

		const response = await fetchWithAuth(
			`${API_URL}/${API_GAMIFICATION_URL}/leaderboard/friends?${query.toString()}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<LeaderboardResponse>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_FRIENDS_LEADERBOARD_ERROR',
				message: error.message || 'Ошибка получения лидерборда друзей',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};
