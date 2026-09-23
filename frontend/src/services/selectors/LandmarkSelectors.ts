import { RootState } from '@store';

export const selectCurrentLandmark = (state: RootState) => state.landmarks.currentLandmark;
export const selectLandmarkSearch = (state: RootState) => state.landmarks.searchResults;
export const selectLandmarkLoading = (state: RootState) => state.landmarks.isLoading;
export const selectLandmarkError = (state: RootState) => state.landmarks.error;