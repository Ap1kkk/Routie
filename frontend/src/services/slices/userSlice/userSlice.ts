import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types/User';
import { clearTokens } from '../../../utils/auth';
import {
	getUserApi,
	getUserRolesApi,
	loginUserApi,
	logoutApi,
	registerUserApi,
} from '../../../utils/api/AuthApi';
import {
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
	isLoading: boolean;
	loginError: string | null;
	registerError: string | null;
};

const initialState: TUserState = {
	initialized: false,
	isAuthenticated: false,
	data: null,
	roles: [],
	isLoading: false,
	loginError: null,
	registerError: null,
};

export const register = createAsyncThunk<
	User,
	RegisterRequest,
	{ rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
	const response: ApiResponse<RegisterResponse> = await registerUserApi(data);
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

	return userResponse.data as unknown as User;
});

export const login = createAsyncThunk<
	{ user: User; roles: string[] },
	LoginRequest,
	{ rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
	const response = await loginUserApi(data);

	if (!response.success || !response.data)
		return rejectWithValue('Login error');

	const userResponse = await getUserApi();
	const rolesResponse = await getUserRolesApi();

	if (!userResponse.success || !userResponse.data) {
		return rejectWithValue('No user');
	}

	const roles = rolesResponse.data?.roles;

	if (!rolesResponse.success || !roles) {
		return rejectWithValue('No roles');
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

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		clearErrors: (state) => {
			state.loginError = null;
			state.registerError = null;
		},
		setInitialized: (state) => {
			state.initialized = true;
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
				state.initialized = false;
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
			});
	},
});

export const { clearErrors, setInitialized } = userSlice.actions;
export default userSlice.reducer;
