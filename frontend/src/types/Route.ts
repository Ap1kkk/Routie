import { Tags } from './Tags';
import { Landmark } from './Landmark';

export type RouteType = 'TOURIST' | 'SPORT' | 'MIXED';

export interface Checkpoint {
	id: string;
	latitude: number;
	longitude: number;
	sortOrder: number;
	landmark: Landmark;
}

export interface CheckpointCreate {
	latitude: number;
	longitude: number;
	sortOrder: number;
	landmarkId: string;
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
	images: RouteImage[];
	tags: Tags[];
}

export interface RouteImage {
	id: string;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface RouteImageUpload {
	id: string;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
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
	tagIds: string[];
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
	tagIds?: string[];
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
