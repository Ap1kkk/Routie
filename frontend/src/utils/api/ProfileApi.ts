import {
	API_URL,
	API_PROFILE_URL,
	handleResponse,
	ApiResponse,
	getHeaders,
} from './Api';
import {
	FullProfile,
	ShortProfile,
	UpdateProfileRequest,
	ProfileImage,
	PaginatedRoutes,
	GetFavoritesParams,
} from '../../types/Profile';
import { fetchWithAuth } from './AuthApi';

export const getMyProfileApi = async (): Promise<ApiResponse<FullProfile>> => {
	try {
		const response = await fetchWithAuth(`${API_URL}/${API_PROFILE_URL}/me`, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<FullProfile>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_PROFILE_ERROR',
				message: error.message || 'Ошибка получения профиля',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getUserProfileApi = async (
	userId: string
): Promise<ApiResponse<FullProfile>> => {
	try {
		const response = await fetchWithAuth(
			`${API_URL}/${API_PROFILE_URL}/${userId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<FullProfile>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_USER_PROFILE_ERROR',
				message: error.message || 'Ошибка получения профиля пользователя',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getShortProfileApi = async (
	userId: string
): Promise<ApiResponse<ShortProfile>> => {
	try {
		const response = await fetchWithAuth(
			`${API_URL}/${API_PROFILE_URL}/short/${userId}`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<ShortProfile>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_SHORT_PROFILE_ERROR',
				message: error.message || 'Ошибка получения краткого профиля',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getUserStatisticsApi = async (
	startDate?: string,
	endDate?: string
): Promise<ApiResponse<any>> => {
	try {
		const queryParams = new URLSearchParams();

		if (startDate) queryParams.append('startDate', startDate);
		if (endDate) queryParams.append('endDate', endDate);

		const url = `${API_URL}/${API_PROFILE_URL}/me/statistics${
			queryParams.toString() ? `?${queryParams.toString()}` : ''
		}`;

		const response = await fetchWithAuth(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_STATISTICS_ERROR',
				message: error.message || 'Ошибка получения статистики',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const getFavoritesApi = async (
	params?: GetFavoritesParams
): Promise<ApiResponse<PaginatedRoutes>> => {
	try {
		const queryParams = new URLSearchParams();
		if (params?.page !== undefined) queryParams.append('page', params.page.toString());
		if (params?.size !== undefined) queryParams.append('size', params.size.toString());

		const url = `${API_URL}/${API_PROFILE_URL}/favorites${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

		const response = await fetchWithAuth(url, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse<PaginatedRoutes>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_FAVORITES_ERROR',
				message: error.message || 'Ошибка получения избранных маршрутов',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const uploadAvatarApi = async (
	file: File
): Promise<ApiResponse<ProfileImage>> => {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const token = localStorage.getItem('accessToken');

		const headers: HeadersInit = {
			Authorization: token ? `Bearer ${token}` : '',
		};

		const response = await fetchWithAuth(`${API_URL}/${API_PROFILE_URL}/avatar`, {
			method: 'PATCH', // ✅ исправили
			headers,
			body: formData,
		});

		return await handleResponse<ProfileImage>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPLOAD_AVATAR_ERROR',
				message: error.message || 'Ошибка загрузки аватара',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const updateProfileApi = async (
	data: UpdateProfileRequest
): Promise<ApiResponse<FullProfile>> => {
	try {
		const formatDate = (date: string | number | Date) => {
			const d = new Date(date);

			const year = d.getFullYear();
			const month = String(d.getMonth() + 1).padStart(2, '0');
			const day = String(d.getDate()).padStart(2, '0');

			return `${year}-${month}-${day}`;
		};

		const payload: Record<string, any> = {};

		if (data.name) payload.name = data.name;
		if (data.username) {
			payload.username = data.username;
		}
		if (data.email) {
			payload.email = data.email;
		}
		if (data.dateOfBirth)
			payload.dateOfBirth = formatDate(data.dateOfBirth);

		if (data.gender) payload.gender = data.gender;

		if (data.city) payload.city = data.city;
		if (data.weight !== undefined) payload.weight = data.weight;
		if (data.height !== undefined) payload.height = data.height;

		if (data.preferredTags?.length) {
			payload.preferredTags = data.preferredTags;
		}

		const response = await fetchWithAuth(`${API_URL}/${API_PROFILE_URL}/me`, {
			method: 'PUT',
			headers: getHeaders(true),
			body: JSON.stringify(payload),
		});

		return await handleResponse<FullProfile>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'UPDATE_PROFILE_ERROR',
				message: error.message || 'Ошибка обновления профиля',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};
