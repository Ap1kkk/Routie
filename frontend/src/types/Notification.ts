export type NotificationType =
	| 'ACHIEVEMENT_UNLOCKED'
	| 'FRIEND_REQUEST'
	| 'ROUTE_COMPLETED'
	| 'LEVEL_UP'
	| 'LIKE'
	| 'COMMENT'
	| 'SYSTEM';

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