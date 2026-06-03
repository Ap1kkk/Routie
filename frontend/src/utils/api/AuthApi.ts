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
		const token = getAccessToken();

		if (token) {
			await fetch(
				`${API_URL}/${API_AUTH_URL}/logout`,
				{
					method: 'POST',
					headers: getHeaders(true),
				}
			);
		}

		clearTokens();

		return {
			success: true,
			timestamp: new Date().toISOString(),
		};
	} catch (error: any) {
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
		const token = getAccessToken();

		if (!token) {
			return {
				success: false,
				error: {
					code: 'AUTH_ERROR',
					message: 'Токен не найден. Пожалуйста, войдите снова.',
					timestamp: new Date().toISOString(),
				},
				timestamp: new Date().toISOString(),
			};
		}

		const response = await fetch(
			`${API_URL}/${API_AUTH_URL}/me`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'AUTH_ERROR',
				message: error.message || 'Ошибка получения данных пользователя',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Получение ролей текущего пользователя */
export const getUserRolesApi = async (): Promise<ApiResponse<RolesResponse>> => {
	try {
		const response = await fetch(
			`${API_URL}/${API_AUTH_URL}/roles`,
			{
				method: 'GET',
				headers: getHeaders(true),
			}
		);

		return await handleResponse<RolesResponse>(response);
	} catch (error: any) {
		return {
			success: false,
			error: {
				code: 'ROLES_ERROR',
				message: error.message || 'Ошибка получения ролей',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};

/** Обновление access токена с использованием refresh токена */
export const refreshTokenApi = async (): Promise<
	ApiResponse<LoginResponseWithTokens>
> => {
	try {
		const refreshToken = getRefreshToken();
		if (!refreshToken) {
			throw new Error('Refresh token не найден');
		}

		const response = await fetch(`${API_URL}/${API_AUTH_URL}/refresh`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ refreshToken }),
		});

		const result = await handleResponse<LoginResponseWithTokens>(response);

		if (result.success && result.data) {
			storeTokens(result.data.accessToken, result.data.refreshToken);
		}

		return result;
	} catch (error: any) {
		clearTokens();
		return {
			success: false,
			error: {
				code: 'REFRESH_TOKEN_ERROR',
				message: error.message || 'Ошибка обновления токена',
				timestamp: new Date().toISOString(),
			},
			timestamp: new Date().toISOString(),
		};
	}
};