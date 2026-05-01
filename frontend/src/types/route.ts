import { Tags } from './tags';
import { Checkpoint } from './checkpoint';

export type UUIDRoute = string;

export interface Route {
	id: UUIDRoute;
	name: string;
	distance: number;
	checkpoints: Checkpoint[];
	tags: Tags[];
	createdAt?: string;
	updatedAt?: string;
}

export interface RouteImage {
	id: string;
	routeId: UUIDRoute;
	imagePath: string;
}

export interface CreateRouteData {
	name: string;
	distance: number;
	checkpoints: Omit<Checkpoint, 'id'>[];
	tagIds: string[];
}

export interface UpdateRouteData {
	name?: string;
	distance?: number;
	checkpoints?: Omit<Checkpoint, 'id'>[];
	tagIds?: string[];
}

export interface RouteFilters {
	name?: string;
	search?: string;
	minDistance?: number;
	maxDistance?: number;
	tagIds?: string[];
}

export interface RoutesResponse {
	data: Route[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
