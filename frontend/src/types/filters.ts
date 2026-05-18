export interface Filters {
	distance: {
		min: number;
		max: number;
	};
	checkpointsCount: {
		min: number;
		max: number;
	};
	categoryIds: string[];
	duration: {
		min: number;
		max: number;
	};
	difficulty: string[];
	rating: number;
}
