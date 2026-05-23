import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	TLoginData,
	TRegisterData,
	TUpdateUserData,
	User,
	UserForAdmin,
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
	getAllUsersApi,
	updateUserByIdApi,
} from '../../../utils/api/user-api';
import { TApiResponse } from '../../../types/api';

type TUserState = {
	isAuthChecked: boolean;
	isAuthenticated: boolean;
	data: User | null;
	isLoading: boolean;
	loginError: string | null;
	registerError: string | null;
	allUsers: UserForAdmin[];
	allUsersLoading: boolean;
	allUsersError: string | null;
	updatingUser: boolean;
};

const initialState: TUserState = {
	isAuthChecked: false,
	isAuthenticated: false,
	data: null,
	isLoading: false,
	loginError: null,
	registerError: null,
	allUsers: [],
	allUsersLoading: false,
	allUsersError: null,
	updatingUser: false,
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

export const fetchAllUsers = createAsyncThunk<
	UserForAdmin[],
	void,
	{ rejectValue: string }
>('user/fetchAllUsers', async (_, { rejectWithValue }) => {
	const response: TApiResponse = await getAllUsersApi();
	if (!response.success) {
		return rejectWithValue(
			response.message || 'Ошибка получения списка пользователей'
		);
	}
	return response.users || [];
});

export const updateUserById = createAsyncThunk<
	UserForAdmin,
	{ id: string; data: Partial<UserForAdmin> },
	{ rejectValue: string }
>('user/updateUserById', async ({ id, data }, { rejectWithValue }) => {
	const response: TApiResponse = await updateUserByIdApi(id, data);
	if (!response.success || !response.user) {
		return rejectWithValue(
			response.message || 'Ошибка обновления пользователя'
		);
	}
	return response.user;
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
		clearAllUsers: (state) => {
			state.allUsers = [];
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
			})

			.addCase(fetchAllUsers.pending, (state) => {
				state.allUsersLoading = true;
				state.allUsersError = null;
			})
			.addCase(fetchAllUsers.fulfilled, (state, action) => {
				state.allUsersLoading = false;
				state.allUsers = action.payload;
			})
			.addCase(fetchAllUsers.rejected, (state, action) => {
				state.allUsersLoading = false;
				state.allUsersError = action.payload as string;
			})

			.addCase(updateUserById.pending, (state) => {
				state.updatingUser = true;
			})
			.addCase(updateUserById.fulfilled, (state, action) => {
				state.updatingUser = false;
				// Обновляем пользователя в списке
				const index = state.allUsers.findIndex(
					(u) => u.id === action.payload.id
				);
				if (index !== -1) {
					state.allUsers[index] = action.payload;
				}
			})
			.addCase(updateUserById.rejected, (state) => {
				state.updatingUser = false;
			});
	},
});

export const { setAuthChecked, clearErrors, clearAllUsers } = userSlice.actions;
export default userSlice.reducer;
