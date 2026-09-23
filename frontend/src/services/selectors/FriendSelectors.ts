import { RootState } from '@store';

export const selectFriendsList = (state: RootState) =>
	state.friends.friendsList;
export const selectFriendsLoading = (state: RootState) =>
	state.friends.isLoading;
export const selectFriendsError = (state: RootState) =>
	state.friends.error;