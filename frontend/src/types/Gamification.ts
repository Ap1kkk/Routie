export interface AchievementIcon {
	id: string;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface UserAchievement {
	achievementId: string;
	title: string;
	description: string;
	icon?: AchievementIcon;
	xpReward: number;
	progress: number;
	targetValue: number;
	isUnlocked: boolean;
	unlockedAt?: string;
}

export interface Achievement {
	id: string;
	title: string;
	description: string;
	icon?: AchievementIcon;
	xpReward: number;
	targetValue: number;
}

export interface AchievementsResponse {
	achievements: UserAchievement[];
	totalUnlocked: number;
	totalAchievements: number;
}

export interface AllAchievementsResponse {
	achievements: Achievement[];
}

export interface XpHistoryItem {
	id: string;
	amount: number;
	reason: string;
	referenceId?: string;
	referenceType?: string;
	createdAt: string;
}

export interface XpHistoryResponse {
	content: XpHistoryItem[];
	totalElements: number;
	totalPages: number;
	number: number;
}

export interface LeaderboardEntry {
	rank: number;
	userId: string;
	name: string;
	username: string;
	avatar?: AchievementIcon;
	currentLevel: number;
	totalXp: number;
	periodXp: number;
}

export interface LeaderboardResponse {
	period: 'WEEK' | 'MONTH' | 'SEASON';
	entries: LeaderboardEntry[];
}
