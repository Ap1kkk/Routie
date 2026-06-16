import { RootState } from '@store';

export const selectAllTags = (state: RootState) =>
	state.tag.allTags;
export const selectCurrentTag = (state: RootState) =>
	state.tag.currentTag;
export const selectTagLoading = (state: RootState) =>
	state.tag.isLoading;
export const selectTagError = (state: RootState) =>
	state.tag.error;