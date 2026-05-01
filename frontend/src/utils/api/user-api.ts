import {
	TLoginData,
	TRegisterData,
	TUpdateUserData,
	User,
	AvatarUser,
	UserTags,
	RoleUser,
	FriendsUser,
	RoutesHistoryUser,
} from '../../types/user';
import {
	clearSession,
	getAccessToken,
	getHeaders,
	getRefreshToken,
	handleResponse,
	saveSession,
} from './api';
import { TApiResponse } from '../../types/api';

const API_URL = 'http://localhost:3001';

const generateUUID = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
		/[xy]/g,
		function (c) {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		}
	);
};

/** Регистрация нового пользователя */
export const registerUserApi = async (
	data: TRegisterData
): Promise<TApiResponse> => {
	try {
		const checkResponse = await fetch(
			`${API_URL}/users?email=${encodeURIComponent(data.email)}`
		);
		const existingUsers = await handleResponse<any[]>(checkResponse);

		if (existingUsers.length > 0) {
			return {
				success: false,
				message: 'Пользователь с таким email уже существует',
			};
		}

		const userId = generateUUID();
		const now = new Date().toISOString();

		const userData: User = {
			id: userId,
			username: data.username,
			name: data.name || '',
			email: data.email,
			number: data.number || '',
			password: data.password,
			level: 1,
			gender: data.gender || 'other',
			height: data.height || 0,
			weight: data.weight || 0,
			birthday: data.birthday || '',
			isAuthenticated: true,
		};

		const response = await fetch(`${API_URL}/users`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(userData),
		});

		const user = await handleResponse<User>(response);

		const avatarData: AvatarUser = {
			id: '',
			user_id: userId,
			avatar: '',
		};

		await fetch(`${API_URL}/avatars`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(avatarData),
		});

		const roleData: RoleUser = {
			user_id: userId,
			role: data.role || 'USER',
		};

		await fetch(`${API_URL}/roles`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(roleData),
		});

		const userTagsData: UserTags = {
			user_id: userId,
			tags: [],
		};

		await fetch(`${API_URL}/user-tags`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(userTagsData),
		});

		const friendsData: FriendsUser = {
			user_id: userId,
			friends: [],
		};

		await fetch(`${API_URL}/friends`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(friendsData),
		});

		const routesHistoryData: RoutesHistoryUser = {
			user_id: userId,
			historyRoutes: [],
		};

		await fetch(`${API_URL}/routes-history`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(routesHistoryData),
		});

		const accessToken = `mock-access-token-${Date.now()}-${user.id}`;
		const refreshToken = `mock-refresh-token-${Date.now()}-${user.id}`;

		await fetch(`${API_URL}/users/${user.id}`, {
			method: 'PATCH',
			headers: getHeaders(),
			body: JSON.stringify({ accessToken, refreshToken }),
		});

		saveSession(accessToken, refreshToken);

		const { password, ...userWithoutPassword } = user;

		return {
			success: true,
			user: userWithoutPassword as User,
			accessToken,
			refreshToken,
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message || 'Ошибка регистрации',
		};
	}
};

/** Авторизация пользователя */
export const loginUserApi = async (data: TLoginData): Promise<TApiResponse> => {
	try {
		const response = await fetch(
			`${API_URL}/users?email=${encodeURIComponent(data.email)}`
		);
		const users = await handleResponse<User[]>(response);

		if (users.length === 0) {
			return {
				success: false,
				message: 'Пользователь с таким email не найден',
			};
		}

		const user = users[0];

		if (user.password !== data.password) {
			return {
				success: false,
				message: 'Неверный пароль',
			};
		}

		// Обновляем статус аутентификации
		await fetch(`${API_URL}/users/${user.id}`, {
			method: 'PATCH',
			headers: getHeaders(),
			body: JSON.stringify({ isAuthenticated: true }),
		});

		const accessToken = `mock-access-token-${Date.now()}-${user.id}`;
		const refreshToken = `mock-refresh-token-${Date.now()}-${user.id}`;

		await fetch(`${API_URL}/users/${user.id}`, {
			method: 'PATCH',
			headers: getHeaders(),
			body: JSON.stringify({ accessToken, refreshToken }),
		});

		saveSession(accessToken, refreshToken);

		const { password, ...userWithoutPassword } = user;

		return {
			success: true,
			user: userWithoutPassword as User,
			accessToken,
			refreshToken,
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message || 'Ошибка входа',
		};
	}
};

/** Выход из системы */
export const logoutApi = async (): Promise<TApiResponse> => {
	try {
		const token = getAccessToken();

		if (token) {
			const usersResponse = await fetch(`${API_URL}/users`);
			const users = await handleResponse<any[]>(usersResponse);
			const user = users.find((u) => u.accessToken === token);

			if (user) {
				await fetch(`${API_URL}/users/${user.id}`, {
					method: 'PATCH',
					headers: getHeaders(),
					body: JSON.stringify({
						accessToken: null,
						refreshToken: null,
					}),
				});
			}
		}

		clearSession();

		return {
			success: true,
			message: 'Выход выполнен успешно',
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message || 'Ошибка выхода',
		};
	}
};

/** Получение данных текущего пользователя */
export const getUserApi = async (): Promise<TApiResponse> => {
	try {
		const token = getAccessToken();

		if (!token) {
			return {
				success: false,
				message: 'Токен не найден. Пожалуйста, войдите снова.',
			};
		}

		const response = await fetch(`${API_URL}/users`);
		const users = await handleResponse<any[]>(response);

		const user = users.find((u) => u.accessToken === token);

		if (!user) {
			return {
				success: false,
				message: 'Сессия истекла. Пожалуйста, войдите снова.',
			};
		}

		const { password, ...userWithoutPassword } = user;

		return {
			success: true,
			user: userWithoutPassword as User,
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message || 'Ошибка получения данных пользователя',
		};
	}
};

/** Обновление данных пользователя */
export const updateUserApi = async (
	data: TUpdateUserData
): Promise<TApiResponse> => {
	try {
		const token = getAccessToken();

		if (!token) {
			return {
				success: false,
				message: 'Токен не найден. Пожалуйста, войдите снова.',
			};
		}

		const usersResponse = await fetch(`${API_URL}/users`);
		const users = await handleResponse<any[]>(usersResponse);
		const currentUser = users.find((u) => u.accessToken === token);

		if (!currentUser) {
			return {
				success: false,
				message: 'Пользователь не найден',
			};
		}

		const updatedUser = {
			...currentUser,
			...data,
			updatedAt: new Date().toISOString(),
		};

		const response = await fetch(`${API_URL}/users/${currentUser.id}`, {
			method: 'PATCH',
			headers: getHeaders(true),
			body: JSON.stringify(updatedUser),
		});

		const user = await handleResponse<any>(response);
		const { password, ...userWithoutPassword } = user;

		return {
			success: true,
			user: userWithoutPassword as User,
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message || 'Ошибка обновления данных',
		};
	}
};

/** Восстановление пароля (отправка инструкций на email) */
export const forgotPasswordApi = async (data: {
	email: string;
}): Promise<TApiResponse> => {
	try {
		const response = await fetch(
			`${API_URL}/users?email=${encodeURIComponent(data.email)}`
		);
		const users = await handleResponse<any[]>(response);

		if (users.length === 0) {
			return {
				success: false,
				message: 'Пользователь с таким email не найден',
			};
		}

		const user = users[0];
		const resetToken = `reset-token-${Date.now()}-${user.id}`;

		await fetch(`${API_URL}/users/${user.id}`, {
			method: 'PATCH',
			headers: getHeaders(),
			body: JSON.stringify({ resetToken }),
		});

		console.log(`Reset token for ${data.email}: ${resetToken}`);

		return {
			success: true,
			message: 'Инструкции по восстановлению отправлены на email',
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message || 'Ошибка восстановления пароля',
		};
	}
};

/** Сброс пароля с использованием токена */
export const resetPasswordApi = async (data: {
	password: string;
	token: string;
}): Promise<TApiResponse> => {
	try {
		const usersResponse = await fetch(`${API_URL}/users`);
		const users = await handleResponse<any[]>(usersResponse);

		const user = users.find((u) => u.resetToken === data.token);

		if (!user) {
			return {
				success: false,
				message:
					'Недействительный токен сброса. Запросите сброс пароля заново.',
			};
		}

		await fetch(`${API_URL}/users/${user.id}`, {
			method: 'PATCH',
			headers: getHeaders(),
			body: JSON.stringify({
				password: data.password,
				resetToken: null,
			}),
		});

		return {
			success: true,
			message: 'Пароль успешно изменен. Теперь вы можете войти.',
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message || 'Ошибка сброса пароля',
		};
	}
};

/** Обновление access токена с использованием refresh токена */
export const refreshTokenApi = async (): Promise<TApiResponse> => {
	try {
		const refreshToken = getRefreshToken();

		if (!refreshToken) {
			return {
				success: false,
				message: 'Refresh token не найден',
			};
		}

		const usersResponse = await fetch(`${API_URL}/users`);
		const users = await handleResponse<any[]>(usersResponse);

		const user = users.find((u) => u.refreshToken === refreshToken);

		if (!user) {
			clearSession();
			return {
				success: false,
				message:
					'Недействительный refresh token. Пожалуйста, войдите снова.',
			};
		}

		const newAccessToken = `mock-access-token-${Date.now()}-${user.id}`;

		await fetch(`${API_URL}/users/${user.id}`, {
			method: 'PATCH',
			headers: getHeaders(),
			body: JSON.stringify({ accessToken: newAccessToken }),
		});

		saveSession(newAccessToken, refreshToken);

		return {
			success: true,
			accessToken: newAccessToken,
			refreshToken,
		};
	} catch (error: any) {
		return {
			success: false,
			message: error.message || 'Ошибка обновления токена',
		};
	}
};
