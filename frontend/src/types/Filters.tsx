import { RouteType } from './Route';

export interface DistanceFilter {
	min: number;
	max: number;
}

export interface CheckpointsFilter {
	min: number;
	max: number;
}

export interface DurationFilter {
	min: number;
	max: number;
}

export interface Filters {
	search?: string;
	distance: DistanceFilter;
	checkpointsCount: CheckpointsFilter;
	duration?: DurationFilter; // ← сделал опциональным
	categoryIds: string[];
	type?: RouteType;
	difficultyMin?: number;
	difficultyMax?: number;
	city?: string;
	favoriteOnly?: boolean;
	hasAudioGuide?: boolean;
}

/** Значения по умолчанию */
export const defaultFilters: Filters = {
	search: '',
	distance: { min: 0, max: 10000 },
	checkpointsCount: { min: 0, max: 50 },
	duration: { min: 0, max: 24 },
	categoryIds: [],
	type: undefined,
	difficultyMin: undefined,
	difficultyMax: undefined,
	city: undefined,
	favoriteOnly: false,
	hasAudioGuide: undefined,
};
