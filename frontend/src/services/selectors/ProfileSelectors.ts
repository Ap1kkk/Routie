import { RootState } from '@store';

export const selectMyProfile = (state: RootState) => state.profile.myProfile;
export const selectUserProfile = (state: RootState) => state.profile.userProfile;
export const selectShortProfile = (state: RootState) => state.profile.shortProfile;
export const selectFavorites = (state: RootState) => state.profile.favorites;
export const selectAvatar = (state: RootState) => state.profile.avatar;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;