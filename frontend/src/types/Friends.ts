export interface FriendAvatar {
	id: string;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface Friend {
	id: string;
	name: string;
	username?: string;
	avatar?: FriendAvatar;
	currentLevel: number;
	totalXp: number;
	isFriend: boolean;
}

export interface PaginatedFriends {
	content: Friend[];
	totalElements: number;
	totalPages: number;
	number: number;
}

export interface FriendsSearchParams {
	page?: number;
	size?: number;
	sort?: string;
	search?: string;
	status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
