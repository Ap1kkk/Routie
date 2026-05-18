import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Tags } from '../../../types/tags';
import { getAllTags } from '../../../utils/api/tags-spi';

interface TagsState {
	items: Tags[];
	loading: boolean;
	error: string | null;
}

const initialState: TagsState = {
	items: [],
	loading: false,
	error: null,
};

export const fetchAllTags = createAsyncThunk(
	'tags/fetchAll',
	async (_, { rejectWithValue }) => {
		try {
			return await getAllTags();
		} catch (error: any) {
			return rejectWithValue(error.message || 'Ошибка загрузки тегов');
		}
	}
);

const tagsSlice = createSlice({
	name: 'tags',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllTags.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				fetchAllTags.fulfilled,
				(state, action: PayloadAction<Tags[]>) => {
					state.loading = false;
					state.items = action.payload;
				}
			)
			.addCase(fetchAllTags.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export default tagsSlice.reducer;
