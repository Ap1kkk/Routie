import { UUID } from './user';

export interface RouteImage {
	id: UUID;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface RouteImageUpload {
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

export interface LandmarkImage {
	id: UUID;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface AudioGuideFile {
	id: UUID;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface AudioGuide {
	id: UUID;
	title: string;
	durationSeconds: number;
	file: AudioGuideFile;
}

export interface Landmark {
	id: UUID;
	title: string;
	description: string;
	images: LandmarkImage[];
	audioGuide?: AudioGuide;
}

export interface Checkpoint {
	id: UUID;
	latitude: number;
	longitude: number;
	sortOrder: number;
	landmark: Landmark;
}

export interface CheckpointCreate {
	latitude: number;
	longitude: number;
	sortOrder: number;
	landmarkId: UUID;
}

export type RouteType = 'SPORT' | 'CULTURAL' | 'HISTORICAL' | 'OTHER';

export interface Route {
	id: UUID;
	title: string;
	description: string;
	type: RouteType;
	difficulty: number;
	lengthMeters: number;
	estimatedTimeMinutes: number;
	city: string;
	completionsCount: number;
	isActive: boolean;
	images: RouteImage[];
	tags: Tag[];
}

export interface FullRoute extends Route {
	checkpoints: Checkpoint[];
}

export interface RouteCreateRequest {
	title: string;
	description: string;
	type: RouteType;
	difficulty: number;
	lengthMeters: number;
	estimatedTimeMinutes: number;
	city: string;
	checkpoints: CheckpointCreate[];
}

export interface RouteUpdateRequest {
	title?: string;
	description?: string;
	type?: RouteType;
	difficulty?: number;
	lengthMeters?: number;
	estimatedTimeMinutes?: number;
	city?: string;
	checkpoints?: CheckpointCreate[];
}

export interface RoutesSearchParams {
	search?: string;
	type?: RouteType;
	difficultyMin?: number;
	difficultyMax?: number;
	lengthMin?: number;
	lengthMax?: number;
	estimatedTimeMin?: number;
	estimatedTimeMax?: number;
	city?: string;
	tags?: string;
	hasAudioGuide?: boolean;
	favoriteOnly?: boolean;
	page?: number;
	size?: number;
	sort?: string;
}

export interface PaginatedRoutes {
	content: Route[];
	totalElements: number;
	totalPages: number;
	number: number;
}

export interface GetRecommendedParams {
	page?: number;
	size?: number;
}
