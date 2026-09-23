import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
	getNotificationsApi,
	getUnreadCountApi,
	getUnreadNotificationsApi,
	markAllAsReadApi,
	markAsReadApi,
} from '../../../utils/api/NotificationsApi';


interface NotificationsState {
	notifications: Notification[];
	unreadNotifications: Notification[];
	unreadCount: number;
	loading: boolean;
	error: string | null;
}

const initialState: NotificationsState = {
	notifications: [],
	unreadNotifications: [],
	unreadCount: 0,
	loading: false,
	error: null,
};

// Thunks
export const fetchNotifications = createAsyncThunk(
	'notifications/fetchNotifications',
	async (params?: { page?: number; size?: number }) => {
		const response = await getNotificationsApi(params);
		if (!response.success || !response.data)
			throw new Error(response.error?.message);
		return response.data;
	}
);

export const fetchUnreadNotifications = createAsyncThunk(
	'notifications/fetchUnreadNotifications',
	async (params?: { page?: number; size?: number }) => {
		const response = await getUnreadNotificationsApi(params);
		if (!response.success || !response.data)
			throw new Error(response.error?.message);
		return response.data;
	}
);

export const fetchUnreadCount = createAsyncThunk(
	'notifications/fetchUnreadCount',
	async () => {
		const response = await getUnreadCountApi();
		if (!response.success) throw new Error(response.error?.message);
		return response.data || 0;
	}
);

export const markAsRead = createAsyncThunk(
	'notifications/markAsRead',
	async (notificationId: string) => {
		const response = await markAsReadApi(notificationId);
		if (!response.success) throw new Error(response.error?.message);
		return notificationId;
	}
);

export const markAllAsRead = createAsyncThunk(
	'notifications/markAllAsRead',
	async () => {
		const response = await markAllAsReadApi();
		if (!response.success) throw new Error(response.error?.message);
		return true;
	}
);

const notificationsSlice = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		addNewNotification: (state, action) => {
			state.notifications.unshift(action.payload);
			if (!action.payload.isRead) {
				state.unreadCount += 1;
			}
		},
		clearNotifications: (state) => {
			state.notifications = [];
			state.unreadNotifications = [];
		},
	},
	extraReducers: (builder) => {
		// ... можно добавить обработчики для остальных thunks
		builder
			.addCase(fetchUnreadCount.fulfilled, (state, action) => {
				state.unreadCount = action.payload;
			})
			.addCase(markAsRead.fulfilled, (state, action) => {
				state.unreadCount = Math.max(0, state.unreadCount - 1);
			})
			.addCase(markAllAsRead.fulfilled, (state) => {
				state.unreadCount = 0;
			});
	},
});

export const { addNewNotification, clearNotifications } =
	notificationsSlice.actions;
export default notificationsSlice.reducer;
