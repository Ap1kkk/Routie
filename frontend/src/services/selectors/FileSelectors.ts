import { RootState } from '@store';

export const selectFileLoading = (state: RootState) =>
	state.file.isLoading;
export const selectUploadProgress = (state: RootState) =>
	state.file.uploadProgress;
export const selectFileError = (state: RootState) =>
	state.file.error;