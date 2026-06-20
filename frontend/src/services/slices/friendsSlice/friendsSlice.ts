import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	removeFriendApi,
	getFriendsApi,
	sendFriendRequestApi,
	rejectFriendRequestApi,
	acceptFriendRequestApi,
} from '../../../utils/api/FriendsApi';
import { FriendsSearchParams, PaginatedFriends } from '../../../types/Friends';

type TFriendsState = {
	friendsList: PaginatedFriends | null;
	isLoading: boolean;
	error: string | null;
};

const initialState: TFriendsState = {
	friendsList: null,
	isLoading: false,
	error: null,
};

export const fetchFriends = createAsyncThunk<
	PaginatedFriends,
	FriendsSearchParams,
	{ rejectValue: string }
>('friends/fetchFriends', async (params, { rejectWithValue }) => {
	const response = await getFriendsApi(params);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка получения списка друзей'
		);

	if (!response.data) return rejectWithValue('Список друзей не найден');

	return response.data;
});

export const sendFriendRequest = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('friends/sendRequest', async (friendId, { rejectWithValue }) => {
	const response = await sendFriendRequestApi(friendId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка отправки запроса в друзья'
		);

	return friendId;
});

export const acceptFriendRequest = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('friends/acceptRequest', async (friendshipId, { rejectWithValue }) => {
	const response = await acceptFriendRequestApi(friendshipId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка принятия запроса в друзья'
		);

	return friendshipId;
});

export const rejectFriendRequest = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('friends/rejectRequest', async (friendshipId, { rejectWithValue }) => {
	const response = await rejectFriendRequestApi(friendshipId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка отклонения запроса в друзья'
		);

	return friendshipId;
});

export const removeFriend = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('friends/removeFriend', async (friendId, { rejectWithValue }) => {
	const response = await removeFriendApi(friendId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка удаления из друзей'
		);

	return friendId;
});

const friendsSlice = createSlice({
	name: 'friends',
	initialState,
	reducers: {
		clearFriendsList: (state) => {
			state.friendsList = null;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFriends.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchFriends.fulfilled, (state, action) => {
				state.isLoading = false;
				state.friendsList = action.payload;
			})
			.addCase(fetchFriends.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(sendFriendRequest.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(sendFriendRequest.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(sendFriendRequest.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(acceptFriendRequest.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(acceptFriendRequest.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(acceptFriendRequest.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(rejectFriendRequest.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(rejectFriendRequest.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(rejectFriendRequest.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(removeFriend.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(removeFriend.fulfilled, (state, action) => {
				state.isLoading = false;
				if (state.friendsList) {
					state.friendsList.content =
						state.friendsList.content.filter(
							(friend) => friend.id !== action.payload
						);
				}
			})
			.addCase(removeFriend.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearFriendsList, clearError } = friendsSlice.actions;
export default friendsSlice.reducer;
