import { RootState } from '@store';

export const selectCurrentLandmark = (state: RootState) => state.landmark.currentLandmark;
export const selectLandmarkSearch = (state: RootState) => state.landmark.searchResults;
export const selectLandmarkLoading = (state: RootState) => state.landmark.isLoading;
export const selectLandmarkError = (state: RootState) => state.landmark.error;