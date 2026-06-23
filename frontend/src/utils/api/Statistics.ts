import {
	API_URL,
	API_STATISTICS_URL,
	ApiResponse,
	getHeaders,
	handleResponse,
} from './Api';
import {
	GamificationStatistics,
	OverviewStatistics,
	PagedResponse,
	PopularRoutesResponse,
	SessionStatistics,
	SessionStatus,
	SessionsSummary,
	UserActivity,
} from '../../types/Statistics';

const buildQuery = (params?: Record<string, string | number | undefined>) => {
	const searchParams = new URLSearchParams();

	if (!params) return '';

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			searchParams.append(key, String(value));
		}
	});

	return searchParams.toString();
};

export const getUsersActivityApi = async (params?: {
	startDate?: string;
	endDate?: string;
	page?: number;
	size?: number;
}): Promise<ApiResponse<PagedResponse<UserActivity>>> => {
	const query = buildQuery(params);

	const response = await fetch(
		`${API_URL}/${API_STATISTICS_URL}/users/activity?${query}`,
		{
			headers: getHeaders(true),
		}
	);

	return handleResponse(response);
};

export const getSessionsApi = async (params?: {
	userId?: string;
	routeId?: string;
	status?: SessionStatus;
	startDate?: string;
	endDate?: string;
	page?: number;
	size?: number;
}): Promise<ApiResponse<PagedResponse<SessionStatistics>>> => {
	const query = buildQuery(params);

	const response = await fetch(
		`${API_URL}/${API_STATISTICS_URL}/sessions?${query}`,
		{
			headers: getHeaders(true),
		}
	);

	return handleResponse(response);
};

export const getSessionsSummaryApi = async (params?: {
	startDate?: string;
	endDate?: string;
	routeId?: string;
}): Promise<ApiResponse<SessionsSummary>> => {
	const query = buildQuery(params);

	const response = await fetch(
		`${API_URL}/${API_STATISTICS_URL}/sessions/summary?${query}`,
		{
			headers: getHeaders(true),
		}
	);

	return handleResponse(response);
};

export const getPopularRoutesApi = async (params?: {
	startDate?: string;
	endDate?: string;
	limit?: number;
}): Promise<ApiResponse<PopularRoutesResponse>> => {
	const query = buildQuery(params);

	const response = await fetch(
		`${API_URL}/${API_STATISTICS_URL}/routes/popular?${query}`,
		{
			headers: getHeaders(true),
		}
	);

	return handleResponse(response);
};

export const getOverviewApi = async (params?: {
	startDate?: string;
	endDate?: string;
}): Promise<ApiResponse<OverviewStatistics>> => {
	const query = buildQuery(params);

	const response = await fetch(
		`${API_URL}/${API_STATISTICS_URL}/overview?${query}`,
		{
			headers: getHeaders(true),
		}
	);

	return handleResponse(response);
};

export const getGamificationStatisticsApi = async (params?: {
	startDate?: string;
	endDate?: string;
}): Promise<ApiResponse<GamificationStatistics>> => {
	const query = buildQuery(params);

	const response = await fetch(
		`${API_URL}/${API_STATISTICS_URL}/gamification?${query}`,
		{
			headers: getHeaders(true),
		}
	);

	return handleResponse(response);
};
