import { getAccessToken } from '../auth';

export const API_URL = 'http://localhost:3001';
export const API_AUTH_URL = 'api/v1/auth';
export const API_PROFILE_URL = 'api/v1/profile';
export const API_ROUTES_URL = 'api/v1/routes';

export interface ApiError {
	code: string;
	message: string;
	details?: string[];
	timestamp: string;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: ApiError;
	timestamp: string;
}

export const getHeaders = (withAuth: boolean = false): HeadersInit => {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (withAuth) {
		const token = getAccessToken();
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
	}
	return headers;
};

export const handleResponse = async <T>(
	response: Response
): Promise<ApiResponse<T>> => {
	const contentType = response.headers.get('content-type');

	if (contentType && contentType.includes('application/json')) {
		const data: ApiResponse<T> = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.error || {
					code: `HTTP_${response.status}`,
					message: `Ошибка сервера: ${response.status}`,
					details: [],
					timestamp: data.timestamp || new Date().toISOString(),
				},
				timestamp: data.timestamp || new Date().toISOString(),
			};
		}

		return data;
	}

	if (!response.ok) {
		return {
			success: false,
			error: {
				code: `HTTP_${response.status}`,
				message: `Ошибка сервера: ${response.status}`,
				details: [],
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}

	if (response.status === 204) {
		return {
			success: true,
			timestamp: new Date().toISOString(),
		};
	}

	return {
		success: true,
		timestamp: new Date().toISOString(),
	};
};

export const request = async <T>(
	url: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	const headers = getHeaders(!!options.headers);
	const response = await fetch(url, {
		...options,
		headers: {
			...headers,
			...options.headers,
		},
	});

	return handleResponse<T>(response);
};
