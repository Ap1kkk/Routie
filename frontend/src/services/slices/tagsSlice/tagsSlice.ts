import { Tag, TagCreateRequest, TagUpdateRequest } from '../../../types/Tags';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	createTagApi,
	deleteTagApi,
	getAllTagsApi,
	getTagApi,
	updateTagApi,
} from '../../../utils/api/TagApi';

type TTagState = {
	allTags: Tag[] | null;
	currentTag: Tag | null;
	isLoading: boolean;
	error: string | null;
};

const tagInitialState: TTagState = {
	allTags: null,
	currentTag: null,
	isLoading: false,
	error: null,
};

export const fetchAllTags = createAsyncThunk<
	Tag[],
	void,
	{ rejectValue: string }
>('tag/fetchAllTags', async (_, { rejectWithValue }) => {
	const response = await getAllTagsApi();
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка получения списка тегов'
		);

	if (!response.data)
		return rejectWithValue('Список тегов не найден');

	return response.data;
});

export const fetchTag = createAsyncThunk<
	Tag,
	string,
	{ rejectValue: string }
>('tag/fetchTag', async (tagId, { rejectWithValue }) => {
	const response = await getTagApi(tagId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка получения тега'
		);

	if (!response.data)
		return rejectWithValue('Тег не найден');

	return response.data;
});

export const createTag = createAsyncThunk<
	Tag,
	TagCreateRequest,
	{ rejectValue: string }
>('tag/createTag', async (data, { rejectWithValue }) => {
	const response = await createTagApi(data);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка создания тега'
		);

	if (!response.data)
		return rejectWithValue('Не удалось создать тег');

	return response.data;
});

export const updateTag = createAsyncThunk<
	Tag,
	{ tagId: string; data: TagUpdateRequest },
	{ rejectValue: string }
>('tag/updateTag', async ({ tagId, data }, { rejectWithValue }) => {
	const response = await updateTagApi(tagId, data);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка обновления тега'
		);

	if (!response.data)
		return rejectWithValue('Не удалось обновить тег');

	return response.data;
});

export const deleteTag = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('tag/deleteTag', async (tagId, { rejectWithValue }) => {
	const response = await deleteTagApi(tagId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка удаления тега'
		);

	return tagId;
});

const tagSlice = createSlice({
	name: 'tag',
	initialState: tagInitialState,
	reducers: {
		clearCurrentTag: (state) => {
			state.currentTag = null;
		},
		clearAllTags: (state) => {
			state.allTags = null;
		},
		clearTagError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllTags.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchAllTags.fulfilled, (state, action) => {
				state.isLoading = false;
				state.allTags = action.payload;
			})
			.addCase(fetchAllTags.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(fetchTag.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchTag.fulfilled, (state, action) => {
				state.isLoading = false;
				state.currentTag = action.payload;
			})
			.addCase(fetchTag.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(createTag.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createTag.fulfilled, (state, action) => {
				state.isLoading = false;
				if (state.allTags) {
					state.allTags.push(action.payload);
				}
			})
			.addCase(createTag.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(updateTag.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateTag.fulfilled, (state, action) => {
				state.isLoading = false;
				if (state.currentTag?.id === action.payload.id) {
					state.currentTag = action.payload;
				}
				if (state.allTags) {
					const index = state.allTags.findIndex(
						(tag) => tag.id === action.payload.id
					);
					if (index !== -1) {
						state.allTags[index] = action.payload;
					}
				}
			})
			.addCase(updateTag.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(deleteTag.fulfilled, (state, action) => {
				if (state.currentTag?.id === action.payload) {
					state.currentTag = null;
				}
				if (state.allTags) {
					state.allTags = state.allTags.filter(
						(tag) => tag.id !== action.payload
					);
				}
			})
			.addCase(deleteTag.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const { clearCurrentTag, clearAllTags, clearTagError } = tagSlice.actions;
export default tagSlice.reducer;