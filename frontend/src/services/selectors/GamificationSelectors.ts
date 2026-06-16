import { RootState } from '@store';

export const selectUserAchievements = (state: RootState) =>
	state.gamification.userAchievements;
export const selectAllAchievements = (state: RootState) =>
	state.gamification.allAchievements;
export const selectLeaderboard = (state: RootState) =>
	state.gamification.leaderboard;
export const selectFriendsLeaderboard = (state: RootState) =>
	state.gamification.friendsLeaderboard;
export const selectXpHistory = (state: RootState) =>
	state.gamification.xpHistory;
export const selectGamificationLoading = (state: RootState) =>
	state.gamification.loading;
export const selectGamificationError = (state: RootState) =>
	state.gamification.error;