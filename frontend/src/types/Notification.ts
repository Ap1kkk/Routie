export type NotificationType =
	| 'ACHIEVEMENT_UNLOCKED'
	| 'XP_AWARDED'
	| 'FRIEND_REQUEST_RECEIVED'
	| 'FRIEND_REQUEST_ACCEPTED'


export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	body: string;
	payload?: any;           // дополнительные данные (например, routeId, userId и т.д.)
	isRead: boolean;
	createdAt: string;
}

export interface PaginatedNotifications {
	content: Notification[];
	totalElements: number;
	totalPages: number;
	number: number;
}

export interface UnreadCountResponse {
	unreadCount: number;
}