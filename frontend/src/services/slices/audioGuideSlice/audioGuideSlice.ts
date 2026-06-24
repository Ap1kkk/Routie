import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	deleteAudioGuideApi,
	getAudioGuideApi,
	searchAudioGuidesApi,
	uploadAudioGuideFileApi,
	createAudioGuideApi,
	updateAudioGuideApi,
} from '../../../utils/api/AudioGuideApi';
import {
	AudioGuide,
	AudioGuideCreateRequest,
	AudioGuidesSearchParams,
	AudioGuideUpdateRequest,
	PaginatedAudioGuides,
} from '../../../types/AudioGuide';

type TAudioGuideState = {
	currentAudioGuide: AudioGuide | null;
	searchResults: PaginatedAudioGuides | null;
	isLoading: boolean;
	error: string | null;
};

const initialState: TAudioGuideState = {
	currentAudioGuide: null,
	searchResults: null,
	isLoading: false,
	error: null,
};

export const fetchAudioGuide = createAsyncThunk<
	AudioGuide,
	string,
	{ rejectValue: string }
>('audioGuide/fetchAudioGuide', async (audioGuideId, { rejectWithValue }) => {
	const response = await getAudioGuideApi(audioGuideId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка получения аудиогида'
		);

	if (!response.data)
		return rejectWithValue('Данные аудиогида не найдены');

	return response.data;
});

export const searchAudioGuides = createAsyncThunk<
	PaginatedAudioGuides,
	AudioGuidesSearchParams,
	{ rejectValue: string }
>('audioGuide/searchAudioGuides', async (params, { rejectWithValue }) => {
	const response = await searchAudioGuidesApi(params);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка поиска аудиогидов'
		);

	if (!response.data)
		return rejectWithValue('Результаты поиска не найдены');

	return response.data;
});

export const createAudioGuide = createAsyncThunk<
	AudioGuide,
	AudioGuideCreateRequest,
	{ rejectValue: string }
>('audioGuide/createAudioGuide', async (data, { rejectWithValue }) => {
	const response = await createAudioGuideApi(data);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка создания аудиогида'
		);

	if (!response.data)
		return rejectWithValue('Не удалось создать аудиогид');

	return response.data;
});

export const updateAudioGuide = createAsyncThunk<
	AudioGuide,
	{ audioGuideId: string; data: AudioGuideUpdateRequest },
	{ rejectValue: string }
>('audioGuide/updateAudioGuide', async ({ audioGuideId, data }, { rejectWithValue }) => {
	const response = await updateAudioGuideApi(audioGuideId, data);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка обновления аудиогида'
		);

	if (!response.data)
		return rejectWithValue('Не удалось обновить аудиогид');

	return response.data;
});

export const deleteAudioGuide = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('audioGuide/deleteAudioGuide', async (audioGuideId, { rejectWithValue }) => {
	const response = await deleteAudioGuideApi(audioGuideId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка удаления аудиогида'
		);

	return audioGuideId;
});

export const uploadAudioGuideFile = createAsyncThunk<
	any,
	{ audioGuideId: string; file: File },
	{ rejectValue: string }
>('audioGuide/uploadFile', async ({ audioGuideId, file }, { rejectWithValue }) => {
	const response = await uploadAudioGuideFileApi(audioGuideId, file);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка загрузки аудиофайла'
		);

	if (!response.data)
		return rejectWithValue('Не удалось загрузить файл');

	return response.data;
});

const audioGuideSlice = createSlice({
	name: 'audioGuide',
	initialState,
	reducers: {
		clearAudioGuide: (state) => {
			state.currentAudioGuide = null;
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
			.addCase(fetchAudioGuide.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchAudioGuide.fulfilled, (state, action) => {
				state.isLoading = false;
				state.currentAudioGuide = action.payload;
			})
			.addCase(fetchAudioGuide.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(searchAudioGuides.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(searchAudioGuides.fulfilled, (state, action) => {
				state.isLoading = false;
				state.searchResults = action.payload;
			})
			.addCase(searchAudioGuides.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(createAudioGuide.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createAudioGuide.fulfilled, (state, action) => {
				state.isLoading = false;

				if (state.searchResults) {
					state.searchResults.content.unshift(action.payload);
					state.searchResults.totalElements += 1;
				}
			})
			.addCase(createAudioGuide.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(updateAudioGuide.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateAudioGuide.fulfilled, (state, action) => {
				state.isLoading = false;
				if (state.currentAudioGuide?.id === action.payload.id) {
					state.currentAudioGuide = action.payload;
				}
			})
			.addCase(updateAudioGuide.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(deleteAudioGuide.fulfilled, (state, action) => {
				if (state.searchResults) {
					state.searchResults.content =
						state.searchResults.content.filter(
							(x) => x.id !== action.payload
						);

					state.searchResults.totalElements -= 1;
				}

				if (state.currentAudioGuide?.id === action.payload) {
					state.currentAudioGuide = null;
				}
			})

			.addCase(uploadAudioGuideFile.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(uploadAudioGuideFile.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(uploadAudioGuideFile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearAudioGuide, clearSearchResults, clearError } = audioGuideSlice.actions;
export default audioGuideSlice.reducer;
