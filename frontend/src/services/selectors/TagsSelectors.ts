import { RootState } from '@store';

export const selectAllTags = (state: RootState) =>
	state.tags.allTags;
export const selectCurrentTag = (state: RootState) =>
	state.tags.currentTag;
export const selectTagLoading = (state: RootState) =>
	state.tags.isLoading;
export const selectTagError = (state: RootState) =>
	state.tags.error;