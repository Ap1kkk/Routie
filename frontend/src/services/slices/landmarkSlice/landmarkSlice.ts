import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	deleteLandmarkApi,
	getLandmarkApi,
	searchLandmarksApi,
	uploadLandmarkImagesApi,
	createLandmarkApi,
	updateLandmarkApi,
} from '../../../utils/api/LandmarkApi';
import {
	Landmark,
	LandmarkCreateRequest,
	LandmarkImage,
	LandmarksSearchParams,
	LandmarkUpdateRequest,
	PaginatedLandmarks,
} from '../../../types/Landmark';

type TLandmarkState = {
	currentLandmark: Landmark | null;
	searchResults: PaginatedLandmarks | null;
	isLoading: boolean;
	error: string | null;
};

const initialState: TLandmarkState = {
	currentLandmark: null,
	searchResults: null,
	isLoading: false,
	error: null,
};

export const fetchLandmark = createAsyncThunk<
	Landmark,
	string,
	{ rejectValue: string }
>('landmark/fetchLandmark', async (landmarkId, { rejectWithValue }) => {
	const response = await getLandmarkApi(landmarkId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка получения достопримечательности'
		);

	if (!response.data)
		return rejectWithValue('Данные достопримечательности не найдены');

	return response.data;
});

export const searchLandmarks = createAsyncThunk<
	PaginatedLandmarks,
	LandmarksSearchParams,
	{ rejectValue: string }
>('landmark/searchLandmarks', async (params, { rejectWithValue }) => {
	const response = await searchLandmarksApi(params);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка поиска достопримечательностей'
		);

	if (!response.data) return rejectWithValue('Результаты поиска не найдены');

	return response.data;
});

export const createLandmark = createAsyncThunk<
	Landmark,
	LandmarkCreateRequest,
	{ rejectValue: string }
>('landmark/createLandmark', async (data, { rejectWithValue }) => {
	const response = await createLandmarkApi(data);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка создания достопримечательности'
		);

	if (!response.data)
		return rejectWithValue('Не удалось создать достопримечательность');

	return response.data;
});

export const updateLandmark = createAsyncThunk<
	Landmark,
	{ landmarkId: string; data: LandmarkUpdateRequest },
	{ rejectValue: string }
>(
	'landmark/updateLandmark',
	async ({ landmarkId, data }, { rejectWithValue }) => {
		const response = await updateLandmarkApi(landmarkId, data);
		if (!response.success || response.error)
			return rejectWithValue(
				response.error?.message ||
					'Ошибка обновления достопримечательности'
			);

		if (!response.data)
			return rejectWithValue('Не удалось обновить достопримечательность');

		return response.data;
	}
);

export const deleteLandmark = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('landmark/deleteLandmark', async (landmarkId, { rejectWithValue }) => {
	const response = await deleteLandmarkApi(landmarkId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка удаления достопримечательности'
		);

	return landmarkId;
});

export const uploadLandmarkImages = createAsyncThunk<
	LandmarkImage[],
	{ landmarkId: string; files: File[] },
	{ rejectValue: string }
>(
	'landmark/uploadImages',
	async ({ landmarkId, files }, { rejectWithValue }) => {
		const response = await uploadLandmarkImagesApi(landmarkId, files);
		if (!response.success || response.error)
			return rejectWithValue(
				response.error?.message ||
					'Ошибка загрузки изображений достопримечательности'
			);

		if (!response.data)
			return rejectWithValue('Не удалось загрузить изображения');

		return response.data;
	}
);


const landmarkSlice = createSlice({
	name: 'landmark',
	initialState,
	reducers: {
		clearLandmark: (state) => {
			state.currentLandmark = null;
		},
		clearSearchResults: (state) => {
			state.searchResults = null;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchLandmark.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchLandmark.fulfilled, (state, action) => {
				state.isLoading = false;
				state.currentLandmark = action.payload;
			})
			.addCase(fetchLandmark.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(searchLandmarks.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(searchLandmarks.fulfilled, (state, action) => {
				state.isLoading = false;
				state.searchResults = action.payload;
			})
			.addCase(searchLandmarks.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(createLandmark.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createLandmark.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(createLandmark.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(updateLandmark.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateLandmark.fulfilled, (state, action) => {
				state.isLoading = false;
				if (state.currentLandmark?.id === action.payload.id) {
					state.currentLandmark = action.payload;
				}
			})
			.addCase(updateLandmark.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(deleteLandmark.fulfilled, (state, action) => {
				if (state.currentLandmark?.id === action.payload) {
					state.currentLandmark = null;
				}
			})

			.addCase(uploadLandmarkImages.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(uploadLandmarkImages.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(uploadLandmarkImages.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

	},
});

export const { clearLandmark, clearSearchResults, clearError } =
	landmarkSlice.actions;
export default landmarkSlice.reducer;
