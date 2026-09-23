import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UploadedFile } from '../../../types/File';
import { fileApi } from '../../../utils/api/FileApi';

type TFileState = {
	isLoading: boolean;
	error: string | null;
	uploadProgress: number;
};

const initialState: TFileState = {
	isLoading: false,
	error: null,
	uploadProgress: 0,
};

export const downloadFile = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('file/downloadFile', async (fileId, { rejectWithValue }) => {
	try {
		const response = await fileApi.download(fileId);

		if (!response.success || !response.data) {
			return rejectWithValue('Ошибка скачивания файла');
		}

		return response.data;
	} catch (error: any) {
		return rejectWithValue(error.message || 'Ошибка скачивания файла');
	}
});

export const uploadFile = createAsyncThunk<
	UploadedFile,
	File,
	{ rejectValue: string }
>('file/uploadFile', async (file, { rejectWithValue }) => {
	const response = await fileApi.upload(file);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка загрузки файла'
		);

	if (!response.data) return rejectWithValue('Не удалось загрузить файл');

	return response.data;
});

export const deleteFile = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('file/deleteFile', async (fileId, { rejectWithValue }) => {
	const response = await fileApi.delete(fileId);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка удаления файла'
		);

	return fileId;
});

const fileSlice = createSlice({
	name: 'file',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		clearUploadProgress: (state) => {
			state.uploadProgress = 0;
		},
		setUploadProgress: (state, action) => {
			state.uploadProgress = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(downloadFile.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(downloadFile.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(downloadFile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(uploadFile.pending, (state) => {
				state.isLoading = true;
				state.error = null;
				state.uploadProgress = 0;
			})
			.addCase(uploadFile.fulfilled, (state) => {
				state.isLoading = false;
				state.uploadProgress = 100;
			})
			.addCase(uploadFile.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(deleteFile.fulfilled, (state) => {
				state.error = null;
			})
			.addCase(deleteFile.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const { clearError, clearUploadProgress, setUploadProgress } =
	fileSlice.actions;
export default fileSlice.reducer;
