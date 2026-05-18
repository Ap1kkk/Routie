// userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	TLoginData,
	TRegisterData,
	TUpdateUserData,
	User,
} from '../../../types/user';
import { clearTokens, storeTokens } from '../../../utils/auth';
import {
	forgotPasswordApi,
	getUserApi,
	loginUserApi,
	logoutApi,
	registerUserApi,
	resetPasswordApi,
	updateUserApi,
} from '../../../utils/api/user-api';
import { TApiResponse } from '../../../types/api';

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
	TRegisterData,
	{ rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
	const response: TApiResponse = await registerUserApi(data);
	if (!response.success)
		return rejectWithValue(response.message || 'Ошибка регистрации');
	storeTokens(response.refreshToken!, response.accessToken!);
	return response.user!;
});

export const login = createAsyncThunk<
	User,
	TLoginData,
	{ rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
	const response: TApiResponse = await loginUserApi(data);
	if (!response.success)
		return rejectWithValue(response.message || 'Ошибка входа');
	storeTokens(response.refreshToken!, response.accessToken!);
	return response.user!;
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
	'user/logout',
	async (_, { rejectWithValue }) => {
		const response = await logoutApi();
		if (!response.success)
			return rejectWithValue(response.message || 'Ошибка выхода');
		clearTokens();
	}
);

export const fetchUser = createAsyncThunk<User, void, { rejectValue: string }>(
	'user/fetchUser',
	async (_, { rejectWithValue }) => {
		const response = await getUserApi();
		if (!response.success)
			return rejectWithValue(
				response.message || 'Ошибка получения пользователя'
			);
		return response.user!;
	}
);

export const updateUser = createAsyncThunk<
	User,
	TUpdateUserData,
	{ rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
	const response = await updateUserApi(data);
	if (!response.success)
		return rejectWithValue(response.message || 'Ошибка обновления');
	return response.user!;
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

			.addCase(updateUser.fulfilled, (state, action) => {
				state.data = action.payload;
			});
	},
});

export const { setAuthChecked, clearErrors } = userSlice.actions;
export default userSlice.reducer;
