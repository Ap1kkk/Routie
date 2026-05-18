import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AchievementItem } from '../../../types/achievments';
import {
	getAllAchievements,
	getUserAchievements,
} from '../../../utils/api/achievements-api';

interface AchievementsState {
	items: AchievementItem[];
	userAchievements: AchievementItem[];
	loading: boolean;
	error: string | null;
}

const initialState: AchievementsState = {
	items: [],
	userAchievements: [],
	loading: false,
	error: null,
};

export const fetchAchievements = createAsyncThunk(
	'achievements/fetchAll',
	async (_, { rejectWithValue }) => {
		try {
			return await getAllAchievements();
		} catch (error: any) {
			return rejectWithValue(
				error.message || 'Ошибка загрузки достижений'
			);
		}
	}
);

export const fetchUserAchievements = createAsyncThunk(
	'achievements/fetchUser',
	async (userId: string, { rejectWithValue }) => {
		try {
			return await getUserAchievements(userId);
		} catch (error: any) {
			return rejectWithValue(
				error.message || 'Ошибка загрузки достижений пользователя'
			);
		}
	}
);

const achievementsSlice = createSlice({
	name: 'achievements',
	initialState,
	reducers: {
		clearAchievementsError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAchievements.pending, (state) => {
				state.loading = true;
			})
			.addCase(
				fetchAchievements.fulfilled,
				(state, action: PayloadAction<AchievementItem[]>) => {
					state.loading = false;
					state.items = action.payload;
				}
			)
			.addCase(fetchAchievements.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})

			.addCase(fetchUserAchievements.fulfilled, (state, action) => {
				state.userAchievements = action.payload;
			});
	},
});

export const { clearAchievementsError } = achievementsSlice.actions;
export default achievementsSlice.reducer;
