import {
	API_AUTH_URL,
	API_URL,
	handleResponse,
	ApiResponse,
	getHeaders,
} from './Api';
import {
	LoginRequest,
	RegisterRequest,
	RolesResponse,
	RegisterResponse,
	LoginResponseWithTokens,
} from '../../types/Auth';
import {
	getAccessToken,
	getRefreshToken,
	storeTokens,
	clearTokens,
} from '../auth';

/** Регистрация нового пользователя */
export const registerUserApi = async (
	data: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_AUTH_URL}/register`,
			{
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify(data),
			}
		);

		const result = await handleResponse<RegisterResponse>(response);

		if (result.success && result.data) {
			storeTokens(result.data.accessToken, result.data.refreshToken);
		}

		return result;
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'REGISTRATION_ERROR',
				message: error.message || 'Ошибка регистрации',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Авторизация пользователя */
export const loginUserApi = async (
	data: LoginRequest
): Promise<ApiResponse<LoginResponseWithTokens>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_AUTH_URL}/login`,
			{
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify(data),
			}
		);

		const result = await handleResponse<LoginResponseWithTokens>(response);

		if (result.success && result.data) {
			storeTokens(result.data.accessToken, result.data.refreshToken);
		}

		return result;
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'LOGIN_ERROR',
				message: error.message || 'Ошибка авторизации',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Выход из системы */
export const logoutApi = async (): Promise<ApiResponse> => {
	try {
		const refreshToken = getRefreshToken();   // ← добавляем

		const response = await fetch(
			`${API_URL}/${API_AUTH_URL}/logout`,
			{
				method: 'POST',
				headers: getHeaders(true),
				body: JSON.stringify({ refreshToken }),   // ← отправляем refreshToken
			}
		);

		const result = await handleResponse(response);

		clearTokens();   // очищаем токены после успешного запроса

		return result;
	} catch (error: any) {
		clearTokens();   // на всякий случай очищаем
		return {
			success: false,
			error: {
				code: 'LOGOUT_ERROR',
				message: error.message || 'Ошибка выхода',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Получение данных текущего пользователя */
export const getUserApi = async (): Promise<ApiResponse> => {
	try {
		const response = await fetchWithAuth(`${API_URL}/${API_AUTH_URL}/me`, {
			method: 'GET',
		});

		return await handleResponse(response);
	} catch (e: any) {
		return {
			success: false,
			error: {
				code: 'AUTH_ERROR',
				message: e.message,
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Получение ролей текущего пользователя */
export const getUserRolesApi = async (): Promise<
	ApiResponse<RolesResponse>
> => {
	const response = await fetchWithAuth(`${API_URL}/${API_AUTH_URL}/roles`, {
		method: 'GET',
	});

	return handleResponse(response);
};

export const getActiveSessionsApi = async (): Promise<ApiResponse<any[]>> => {
	try {
		const response = await fetch(`${API_URL}/${API_AUTH_URL}/sessions`, {
			method: 'GET',
			headers: getHeaders(true),
		});

		return await handleResponse(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'GET_SESSIONS_ERROR',
				message: error.message || 'Ошибка получения активных сессий',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Завершение сессии по deviceId */
export const terminateSessionApi = async (
	deviceId: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_AUTH_URL}/sessions/${deviceId}`,
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
				code: 'TERMINATE_SESSION_ERROR',
				message: error.message || 'Ошибка завершения сессии',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Обновление access токена с использованием refresh токена */
export const refreshTokenApi = async (): Promise<boolean> => {
	try {
		const refreshToken = getRefreshToken();

		if (!refreshToken) {
			clearTokens();
			return false;
		}

		const response = await fetch(`${API_URL}/${API_AUTH_URL}/refresh`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({
				refreshToken,
			}),
		});

		const result = await handleResponse<LoginResponseWithTokens>(response);

		if (!result.success || !result.data) {
			clearTokens();
			return false;
		}

		storeTokens(result.data.accessToken, result.data.refreshToken);

		return true;
	} catch {
		clearTokens();
		return false;
	}
};

let isRefreshing = false;
let queue: (() => void)[] = [];

export const fetchWithAuth = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	let token = getAccessToken();

	const doRequest = () =>
		fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

	let response = await doRequest();

	if (response.status !== 401) return response;

	if (isRefreshing) {
		await new Promise<void>((resolve) => queue.push(resolve));
		token = getAccessToken();
		return doRequest();
	}

	isRefreshing = true;

	const refreshed = await refreshTokenApi();

	isRefreshing = false;

	queue.forEach((cb) => cb());
	queue = [];

	if (!refreshed) {
		clearTokens();
		window.location.href = '/login';
		throw new Error('Session expired');
	}

	token = getAccessToken();

	return doRequest();
};

/** 1. Запрос кода восстановления на почту */
export const requestPasswordResetApi = async (
	email: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_AUTH_URL}/password/reset/request`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			}
		);

		return await handleResponse<string>(response);
	} catch (error: any) {
		console.error('Request password reset error:', error);
		return {
			success: false,
			error: {
				code: 'PASSWORD_RESET_REQUEST_ERROR',
				message: error.message || 'Не удалось отправить код',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** 2. Подтверждение кода и смена пароля */
export const confirmPasswordResetApi = async (data: {
	email: string;
	code: string;
	newPassword: string;
}): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_AUTH_URL}/password/reset/confirm`,
			{
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify(data),
			}
		);

		return await handleResponse<string>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'PASSWORD_RESET_CONFIRM_ERROR',
				message: error.message || 'Ошибка подтверждения кода',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

export const authApi = {
	register: registerUserApi,
	login: loginUserApi,
	logout: logoutApi,
	getUser: getUserApi,
	getUserRoles: getUserRolesApi,
	getActiveSessions: getActiveSessionsApi,
	terminateSession: terminateSessionApi,
	refreshToken: refreshTokenApi,
	requestPasswordReset: requestPasswordResetApi,
	confirmPasswordReset: confirmPasswordResetApi,
};