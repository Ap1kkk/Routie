import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../../types/User';
import { clearTokens } from '../../../utils/auth';
import {
	confirmPasswordResetApi,
	getActiveSessionsApi,
	getUserApi,
	getUserRolesApi,
	loginUserApi,
	logoutApi,
	registerUserApi,
	requestPasswordResetApi,
	terminateSessionApi,
} from '../../../utils/api/AuthApi';
import {
	ActiveSession,
	LoginRequest,
	RegisterRequest,
	RegisterResponse,
} from '../../../types/Auth';
import { ApiResponse } from '../../../utils/api/Api';

type TUserState = {
	initialized: boolean;
	isAuthenticated: boolean;
	data: User | null;
	roles: string[];
	activeSessions: ActiveSession[];
	isLoading: boolean;
	loginError: string | null;
	registerError: string | null;
	sessionsLoading: boolean;
	sessionsError: string | null;
};

const initialState: TUserState = {
	initialized: false,
	isAuthenticated: false,
	data: null,
	roles: [],
	activeSessions: [],
	isLoading: false,
	loginError: null,
	registerError: null,
	sessionsLoading: false,
	sessionsError: null,
};

export const register = createAsyncThunk<
	User,
	RegisterRequest,
	{ rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
	const response: ApiResponse<RegisterResponse> = await registerUserApi({
		...data,
	});

	if (!response.success || response.error)
		return rejectWithValue(response.error?.message || 'Ошибка регистрации');

	if (!response.data)
		return rejectWithValue('Ошибка регистрации: данные не получены');

	const userResponse = await getUserApi();

	if (!userResponse.success || userResponse.error || !userResponse.data)
		return rejectWithValue(
			userResponse.error?.message ||
				'Ошибка получения данных пользователя'
		);

	return userResponse.data as User;
});

export const login = createAsyncThunk<
	{ user: User; roles: string[] },
	LoginRequest,
	{ rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
	const response = await loginUserApi(data);

	if (!response.success || response.error || !response.data) {
		return rejectWithValue(
			response.error?.message || 'Неверный email или пароль'
		);
	}

	const userResponse = await getUserApi();
	const rolesResponse = await getUserRolesApi();

	if (!userResponse.success || !userResponse.data) {
		return rejectWithValue(
			userResponse.error?.message ||
				'Не удалось получить данные пользователя'
		);
	}

	const roles = rolesResponse.data?.roles;

	if (!rolesResponse.success || !roles) {
		return rejectWithValue(
			rolesResponse.error?.message || 'Не удалось получить роли'
		);
	}

	return {
		user: userResponse.data as User,
		roles: roles,
	};
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
	'user/logout',
	async (_, { rejectWithValue }) => {
		const response = await logoutApi();
		if (!response.success || response.error)
			return rejectWithValue(response.error?.message || 'Ошибка выхода');
		clearTokens();
	}
);

export const fetchActiveSessions = createAsyncThunk<
	ActiveSession[],
	void,
	{ rejectValue: string }
>('auth/fetchActiveSessions', async (_, { rejectWithValue }) => {
	const response = await getActiveSessionsApi();

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message || 'Не удалось загрузить активные сессии'
		);
	}

	return response.data;
});

export const requestPasswordReset = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('auth/requestPasswordReset', async (email, { rejectWithValue }) => {
	const response = await requestPasswordResetApi(email);

	if (!response.success) {
		return rejectWithValue(
			response.error?.message || 'Не удалось отправить код на почту'
		);
	}

	return 'Код успешно отправлен на вашу почту';
});

export const confirmPasswordReset = createAsyncThunk<
	string,
	{ email: string; code: string; newPassword: string },
	{ rejectValue: string }
>('auth/confirmPasswordReset', async (data, { rejectWithValue }) => {
	const response = await confirmPasswordResetApi(data);

	if (!response.success) {
		return rejectWithValue(
			response.error?.message || 'Не удалось сменить пароль'
		);
	}

	return response.data || 'Пароль успешно изменён';
});

export const terminateSession = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('auth/terminateSession', async (deviceId, { rejectWithValue }) => {
	const response = await terminateSessionApi(deviceId);

	if (!response.success) {
		return rejectWithValue(
			response.error?.message || 'Не удалось завершить сессию'
		);
	}

	return deviceId;
});

export const initAuth = createAsyncThunk<
	{ user: User; roles: string[] },
	void,
	{ rejectValue: string }
>('user/initAuth', async (_, { rejectWithValue }) => {
	try {
		const userResponse = await getUserApi();
		if (!userResponse.success || !userResponse.data) {
			return rejectWithValue('No user');
		}

		const rolesResponse = await getUserRolesApi();
		if (!rolesResponse.success || !rolesResponse.data) {
			return rejectWithValue('No roles');
		}

		return {
			user: userResponse.data as User,
			roles: rolesResponse.data.roles,
		};
	} catch (e: any) {
		return rejectWithValue(e.message);
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearErrors: (state) => {
			state.loginError = null;
			state.registerError = null;
		},
		setInitialized: (state) => {
			state.initialized = true;
		},
		resetAuthState: () => initialState,
		clearSessionsError: (state) => {
			state.sessionsError = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.isLoading = true;
				state.registerError = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.initialized = true;
				state.isLoading = false;
				state.isAuthenticated = true;
				state.data = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.registerError = action.payload as string;
			})

			.addCase(login.pending, (state) => {
				state.isLoading = true;
				state.loginError = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.initialized = true;
				state.isLoading = false;
				state.isAuthenticated = true;

				state.data = action.payload.user;
				state.roles = action.payload.roles;
			})

			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.loginError = action.payload as string;
			})
			.addCase(logout.fulfilled, (state) => {
				state.isAuthenticated = false;
				state.data = null;
				state.roles = [];
				state.activeSessions = [];
				state.initialized = false;
				state.loginError = null;
				state.registerError = null;
			})

			.addCase(initAuth.fulfilled, (state, action) => {
				state.initialized = true;
				state.isAuthenticated = true;
				state.data = action.payload.user;
				state.roles = action.payload.roles;
			})
			.addCase(initAuth.rejected, (state) => {
				state.initialized = true;
				state.isAuthenticated = false;
				state.data = null;
				state.roles = [];
			})

			.addCase(fetchActiveSessions.pending, (state) => {
				state.sessionsLoading = true;
				state.sessionsError = null;
			})
			.addCase(fetchActiveSessions.fulfilled, (state, action) => {
				state.sessionsLoading = false;
				state.activeSessions = action.payload;
			})
			.addCase(fetchActiveSessions.rejected, (state, action) => {
				state.sessionsLoading = false;
				state.sessionsError = action.payload as string;
			})
			.addCase(terminateSession.pending, (state) => {
				state.sessionsLoading = true;
			})
			.addCase(terminateSession.fulfilled, (state, action) => {
				state.sessionsLoading = false;
				state.activeSessions = state.activeSessions.filter(
					(session) => session.deviceId !== action.payload
				);
			})
			.addCase(terminateSession.rejected, (state, action) => {
				state.sessionsLoading = false;
				state.sessionsError = action.payload as string;
			});
	},
});

export const { clearErrors, setInitialized, resetAuthState } =
	authSlice.actions;
export default authSlice.reducer;
