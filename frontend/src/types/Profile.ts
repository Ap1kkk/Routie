export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Avatar {
	id: string;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface FullProfile {
	id: string;
	email: string;
	name: string;
	username: string;
	avatar?: Avatar;
	dateOfBirth?: string;
	gender?: Gender;
	city?: string;
	favoriteSportType?: string;
	preferredTransport?: string;
	weight?: number;
	height?: number;

	preferredTags?: Tag[];

	totalXp: number;
	currentLevel: number;
	totalDistanceMeters: number;
	totalRoutesCompleted: number;
	totalLandmarksVisited: number;
	isFriend: boolean;
	createdAt: string;
}

export interface ShortProfile {
	id: string;
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
	username?: string;
	email?: string;
	dateOfBirth?: string;
	gender?: Gender;
	city?: string;
	weight?: number;
	height?: number;
	preferredTags?: string[];
}

export interface ProfileImage {
	id: string;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface Tag {
	id: string;
	title: string;
}

export interface Route {
	id: string;
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
