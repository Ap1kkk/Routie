import { RouteType } from './Route';

export interface Filters {
	search?: string;
	type?: RouteType;

	difficultyMin?: number;
	difficultyMax?: number;

	lengthMin?: number;
	lengthMax?: number;

	estimatedTimeMin?: number;
	estimatedTimeMax?: number;

	city?: string;

	tags?: string[];

	hasAudioGuide?: boolean;
	favoriteOnly?: boolean;

	page?: number;
	size?: number;
	sort?: string;
}

export const defaultFilters: Filters = {
	search: '',
	tags: [],
	hasAudioGuide: false,
	favoriteOnly: false,
	page: 0,
	size: 20,
};
