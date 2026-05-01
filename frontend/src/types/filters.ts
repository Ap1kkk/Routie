export interface Filters {
	distance: {
		min: number;
		max: number;
	};
	checkpointsCount: {
		min: number;
		max: number;
	};
	categoryIds: string[]; // Используем string для ID тегов
	duration: {
		min: number;
		max: number;
	};
	difficulty: string[];
	rating: number;
}
