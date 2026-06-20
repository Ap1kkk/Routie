import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
	getMyProfileApi,
	getUserProfileApi,
	getShortProfileApi,
	getFavoritesApi,
	updateProfileApi,
	uploadAvatarApi,
} from '../../../utils/api/ProfileApi';

import {
	FullProfile,
	ShortProfile,
	UpdateProfileRequest,
	ProfileImage,
	PaginatedRoutes,
	GetFavoritesParams,
} from '../../../types/Profile';

interface ProfileState {
	myProfile: FullProfile | null;
	userProfile: FullProfile | null;
	shortProfile: ShortProfile | null;
	favorites: PaginatedRoutes | null;
	avatar: ProfileImage | null;
	loading: boolean;
	error: string | null;
}

const initialState: ProfileState = {
	myProfile: null,
	userProfile: null,
	shortProfile: null,
	favorites: null,
	avatar: null,
	loading: false,
	error: null,
};

// ==================== THUNKS ====================

export const getMyProfile = createAsyncThunk<
	FullProfile,
	void,
	{ rejectValue: string }
>('profile/getMyProfile', async (_, { rejectWithValue }) => {
	const response = await getMyProfileApi();

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message || 'Ошибка получения профиля'
		);
	}

	return response.data;
});

export const getUserProfile = createAsyncThunk<
	FullProfile,
	string,
	{ rejectValue: string }
>('profile/getUserProfile', async (userId, { rejectWithValue }) => {
	const response = await getUserProfileApi(userId);

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message ||
			'Ошибка получения профиля пользователя'
		);
	}

	return response.data;
});

export const getShortProfile = createAsyncThunk<
	ShortProfile,
	string,
	{ rejectValue: string }
>('profile/getShortProfile', async (userId, { rejectWithValue }) => {
	const response = await getShortProfileApi(userId);

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message ||
			'Ошибка получения краткого профиля'
		);
	}

	return response.data;
});

export const getFavorites = createAsyncThunk<
	PaginatedRoutes,
	GetFavoritesParams | undefined,
	{ rejectValue: string }
>('profile/getFavorites', async (params, { rejectWithValue }) => {
	const response = await getFavoritesApi(params);

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message ||
			'Ошибка получения избранных маршрутов'
		);
	}

	return response.data;
});

export const updateProfile = createAsyncThunk<
	FullProfile,
	UpdateProfileRequest,
	{ rejectValue: string }
>('profile/updateProfile', async (data, { rejectWithValue }) => {
	const response = await updateProfileApi(data);

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message ||
			'Ошибка обновления профиля'
		);
	}

	return response.data;
});

export const uploadAvatar = createAsyncThunk<
	ProfileImage,
	File,
	{ rejectValue: string }
>('profile/uploadAvatar', async (file, { rejectWithValue }) => {
	const response = await uploadAvatarApi(file);

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message ||
			'Ошибка загрузки аватара'
		);
	}

	return response.data;
});

// ==================== SLICE ====================

const profileSlice = createSlice({
	name: 'profile',
	initialState,

	reducers: {
		clearProfileError(state) {
			state.error = null;
		},

		clearUserProfile(state) {
			state.userProfile = null;
		},

		resetProfileState() {
			return initialState;
		},
	},

	extraReducers: builder => {
		builder

			.addCase(getMyProfile.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getMyProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.myProfile = action.payload;
			})
			.addCase(getMyProfile.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload || 'Ошибка получения профиля';
			})

			.addCase(getUserProfile.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getUserProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.userProfile = action.payload;
			})
			.addCase(getUserProfile.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload ||
					'Ошибка получения профиля пользователя';
			})

			.addCase(getShortProfile.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getShortProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.shortProfile = action.payload;
			})
			.addCase(getShortProfile.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload ||
					'Ошибка получения краткого профиля';
			})

			.addCase(getFavorites.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getFavorites.fulfilled, (state, action) => {
				state.loading = false;
				state.favorites = action.payload;
			})
			.addCase(getFavorites.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload ||
					'Ошибка получения избранных маршрутов';
			})

			.addCase(updateProfile.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.myProfile = action.payload;
			})
			.addCase(updateProfile.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload ||
					'Ошибка обновления профиля';
			})

			.addCase(uploadAvatar.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(uploadAvatar.fulfilled, (state, action) => {
				state.loading = false;
				state.avatar = action.payload;
			})
			.addCase(uploadAvatar.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload ||
					'Ошибка загрузки аватара';
			});
	},
});

export const {
	clearProfileError,
	clearUserProfile,
	resetProfileState,
} = profileSlice.actions;

export default profileSlice.reducer;