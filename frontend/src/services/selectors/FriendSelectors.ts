import { RootState } from '@store';

export const selectFriendsList = (state: RootState) =>
	state.friend.friendsList;
export const selectFriendsLoading = (state: RootState) =>
	state.friend.isLoading;
export const selectFriendsError = (state: RootState) =>
	state.friend.error;