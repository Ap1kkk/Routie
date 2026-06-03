import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types/User';
import { clearTokens } from '../../../utils/auth';
import {
	getUserApi,
	loginUserApi,
	logoutApi,
	registerUserApi,
	refreshTokenApi,
} from '../../../utils/api/AuthApi';
import {
	LoginRequest,
	RegisterRequest,
	RegisterResponse,
	LoginResponseWithTokens,
} from '../../../types/Auth';
import { ApiResponse } from '../../../utils/api/Api';

type TUserState = {
	isAuthChecked: boolean;
	isAuthenticated: boolean;
	data: User | null;
	isLoading: boolean;
	loginError: string | null;
	registerError: string | null;
};

const initialState: TUserState = {
	isAuthChecked: false,
	isAuthenticated: false,
	data: null,
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
		return rejectWithValue(userResponse.error?.message || 'Ошибка получения данных пользователя');

	return userResponse.data as unknown as User;
});

export const login = createAsyncThunk<
	User,
	LoginRequest,
	{ rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
	const response: ApiResponse<LoginResponseWithTokens> = await loginUserApi(data);
	if (!response.success || response.error)
		return rejectWithValue(response.error?.message || 'Ошибка входа');

	if (!response.data)
		return rejectWithValue('Ошибка входа: данные не получены');

	if (response.data.user) {
		return response.data.user as unknown as User;
	}

	const userResponse = await getUserApi();
	if (!userResponse.success || userResponse.error || !userResponse.data)
		return rejectWithValue(userResponse.error?.message || 'Ошибка получения данных пользователя');

	return userResponse.data as unknown as User;
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

export const refreshToken = createAsyncThunk<
	LoginResponseWithTokens | null,
	void,
	{ rejectValue: string }
>('user/refreshToken', async (_, { rejectWithValue }) => {
	const response = await refreshTokenApi();

	if (!response.success || !response.data) {
		clearTokens();
		return rejectWithValue(
			response.error?.message || 'Ошибка обновления токена'
		);
	}

	return response.data;
});

export const fetchUser = createAsyncThunk<
	User,
	void,
	{ rejectValue: string }
>('user/fetchUser', async (_, { rejectWithValue, dispatch }) => {
	let response = await getUserApi();

	if (!response.success) {
		const refreshResult = await dispatch(refreshToken())
			.unwrap()
			.catch(() => null);

		if (refreshResult) {
			response = await getUserApi();
		}
	}

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message || 'Ошибка получения пользователя'
		);
	}

	return response.data as User;
});

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setAuthChecked: (state, action: PayloadAction<boolean>) => {
			state.isAuthChecked = action.payload;
		},
		clearErrors: (state) => {
			state.loginError = null;
			state.registerError = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.isLoading = true;
				state.registerError = null;
			})
			.addCase(register.fulfilled, (state, action) => {
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
				state.isLoading = false;
				state.isAuthenticated = true;
				state.data = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.loginError = action.payload as string;
			})

			.addCase(logout.fulfilled, (state) => {
				state.isAuthenticated = false;
				state.data = null;
			})

			.addCase(fetchUser.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.isAuthChecked = true;
				state.data = action.payload;
			})
			.addCase(fetchUser.rejected, (state) => {
				state.isAuthChecked = true;
				state.isAuthenticated = false;
				state.data = null;
			})

			.addCase(refreshToken.fulfilled, (state) => {})
			.addCase(refreshToken.rejected, (state) => {
				state.isAuthenticated = false;
				state.data = null;
				state.isAuthChecked = true;
			});
	},
});

export const { setAuthChecked, clearErrors } = userSlice.actions;
export default userSlice.reducer;
