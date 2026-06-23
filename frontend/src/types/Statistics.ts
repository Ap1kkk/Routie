export interface PagedResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
}

export interface UserActivity {
	userId: string;
	name: string;
	username: string;
	currentLevel: number;
	totalXp: number;
	routesCompleted: number;
	totalDistanceMeters: number;
	lastActivityDate: string;
}

export type SessionStatus = 'ACTIVE' | 'FINISHED' | 'ABORTED';

export interface SessionStatistics {
	id: string;
	userId: string;
	username: string;
	userDisplayName: string;
	routeId: string;
	routeTitle: string;
	status: SessionStatus;
	startedAt: string;
	finishedAt: string | null;
	totalDurationSeconds: number;
	totalDistanceMeters: number;
	avgSpeedKmh: number;
}

export interface SessionsSummary {
	totalSessions: number;
	finishedCount: number;
	abortedCount: number;
	activeCount: number;
	completionRate: number;
	avgDurationSeconds: number;
	avgSpeedKmh: number;
	avgDistanceMeters: number;
}

export interface PopularRoute {
	routeId: string;
	title: string;
	type: string;
	completionsCount: number;
	city: string;
}

export interface PopularRoutesResponse {
	routes: PopularRoute[];
}

export interface OverviewStatistics {
	totalUsers: number;
	activeUsersLast30Days: number;
	totalRoutesCompleted: number;
	totalDistanceMeters: number;
	totalXpEarned: number;
	averageLevel: number;
}

export interface GamificationStatistics {
	totalXpDistributed: number;
	averageXpPerUser: number;
	topAchievement: string;
	usersByLevel: Record<string, number>;
	mostPopularPeriod: string;
}
