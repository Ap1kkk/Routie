import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	AchievementsResponse,
	AllAchievementsResponse,
	LeaderboardResponse,
	XpHistoryResponse,
} from 'src/types/Gamification';
import {
	getAchievementsApi,
	getAllAchievementsApi,
	getFriendsLeaderboardApi,
	getLeaderboardApi,
	getXpHistoryApi,
} from '../../../utils/api/Gamification';

interface gamificationState {
	userAchievements: AchievementsResponse['achievements'];
	allAchievements: AllAchievementsResponse['achievements'];
	xpHistory: XpHistoryResponse | null;
	leaderboard: LeaderboardResponse | null;
	friendsLeaderboard: LeaderboardResponse | null;

	loading: boolean;
	error: string | null;
}

const initialState: gamificationState = {
	userAchievements: [],
	allAchievements: [],
	xpHistory: null,
	leaderboard: null,
	friendsLeaderboard: null,
	loading: false,
	error: null,
};

export const fetchAchievements = createAsyncThunk<
	AchievementsResponse,
	void,
	{ rejectValue: string }
>('achievements/fetchAchievements', async (_, { rejectWithValue }) => {
	const response = await getAchievementsApi();

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message || 'Ошибка получения достижений'
		);
	}

	return response.data;
});

export const fetchAllAchievements = createAsyncThunk<
	AllAchievementsResponse,
	void,
	{ rejectValue: string }
>('achievements/fetchAllAchievements', async (_, { rejectWithValue }) => {
	const response = await getAllAchievementsApi();

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message || 'Ошибка получения всех достижений'
		);
	}

	return response.data;
});

export const fetchXpHistory = createAsyncThunk<
	XpHistoryResponse,
	{ page?: number; size?: number; sort?: string } | undefined,
	{ rejectValue: string }
>('achievements/fetchXpHistory', async (params, { rejectWithValue }) => {
	const response = await getXpHistoryApi(params);

	if (!response.success || !response.data) {
		return rejectWithValue(
			response.error?.message || 'Ошибка получения истории XP'
		);
	}

	return response.data;
});

export const fetchLeaderboard = createAsyncThunk<
	LeaderboardResponse,
	{ period: 'WEEK' | 'MONTH' | 'SEASON'; limit?: number },
	{ rejectValue: string }
>(
	'achievements/fetchLeaderboard',
	async ({ period, limit = 100 }, { rejectWithValue }) => {
		const response = await getLeaderboardApi(period, limit);

		if (!response.success || !response.data) {
			return rejectWithValue(
				response.error?.message || 'Ошибка получения лидерборда'
			);
		}

		return response.data;
	}
);

export const fetchFriendsLeaderboard = createAsyncThunk<
	LeaderboardResponse,
	{ period: 'WEEK' | 'MONTH' | 'SEASON'; limit?: number },
	{ rejectValue: string }
>(
	'achievements/fetchFriendsLeaderboard',
	async ({ period, limit = 50 }, { rejectWithValue }) => {
		const response = await getFriendsLeaderboardApi(period, limit);

		if (!response.success || !response.data) {
			return rejectWithValue(
				response.error?.message || 'Ошибка получения лидерборда друзей'
			);
		}

		return response.data;
	}
);

const gamificationSlice = createSlice({
	name: 'gamification',
	initialState,

	reducers: {
		clearAchievementsError(state) {
			state.error = null;
		},

		resetAchievementsState() {
			return initialState;
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(fetchAchievements.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAchievements.fulfilled, (state, action) => {
				state.loading = false;
				state.userAchievements = action.payload.achievements;
			})
			.addCase(fetchAchievements.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка получения достижений';
			})

			.addCase(fetchAllAchievements.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAllAchievements.fulfilled, (state, action) => {
				state.loading = false;
				state.allAchievements = action.payload.achievements;
			})
			.addCase(fetchAllAchievements.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload || 'Ошибка получения всех достижений';
			})

			.addCase(fetchXpHistory.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchXpHistory.fulfilled, (state, action) => {
				state.loading = false;
				state.xpHistory = action.payload;
			})
			.addCase(fetchXpHistory.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка получения истории XP';
			})

			.addCase(fetchLeaderboard.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchLeaderboard.fulfilled, (state, action) => {
				state.loading = false;
				state.leaderboard = action.payload;
			})
			.addCase(fetchLeaderboard.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Ошибка получения лидерборда';
			})

			.addCase(fetchFriendsLeaderboard.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchFriendsLeaderboard.fulfilled, (state, action) => {
				state.loading = false;
				state.friendsLeaderboard = action.payload;
			})
			.addCase(fetchFriendsLeaderboard.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.payload || 'Ошибка получения лидерборда друзей';
			});
	},
});

export const { clearAchievementsError, resetAchievementsState } =
	gamificationSlice.actions;

export default gamificationSlice.reducer;
