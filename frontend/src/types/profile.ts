import { UUID } from './user';

export interface Avatar {
	id: UUID;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface FullProfile {
	id: UUID;
	email: string;
	name: string;
	username: string;
	avatar?: Avatar;
	dateOfBirth?: string;
	gender?: Gender;
	city?: string;
	favoriteSportType?: string;
	preferredTransport?: string;
	totalXp: number;
	currentLevel: number;
	totalDistanceMeters: number;
	totalRoutesCompleted: number;
	totalLandmarksVisited: number;
	isFriend: boolean;
	createdAt: string;
}

export interface ShortProfile {
	id: UUID;
	firstName?: string;
	lastName?: string;
	avatar?: Avatar;
	currentLevel: number;
	totalXp: number;
	city?: string;
	isFriend: boolean;
}

export interface UpdateProfileRequest {
	name?: string;
	dateOfBirth?: string;
	gender?: Gender;
	city?: string;
	preferredTransport?: string;
}

export interface ProfileImage {
	id: UUID;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface Tag {
	id: UUID;
	title: string;
}

export interface Route {
	id: UUID;
	title: string;
	description: string;
	type: string;
	difficulty: number;
	lengthMeters: number;
	estimatedTimeMinutes: number;
	city: string;
	completionsCount: number;
	isActive: boolean;
	images: ProfileImage[];
	tags: Tag[];
}

export interface PaginatedRoutes {
	content: Route[];
	totalElements: number;
	totalPages: number;
	number: number;
}

export interface GetFavoritesParams {
	page?: number;
	size?: number;
}
