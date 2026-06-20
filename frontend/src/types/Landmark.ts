export interface LandmarkImage {
	id: string;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface AudioGuideFile {
	id: string;
	filename: string;
	contentType: string;
	createTs: string;
	sortOrder: number;
}

export interface AudioGuide {
	id: string;
	title: string;
	durationSeconds: number;
	file: AudioGuideFile;
}

export interface Landmark {
	id: string;
	title: string;
	description: string;
	images: LandmarkImage[];
	audioGuide?: AudioGuide;
}

export interface LandmarkCreateRequest {
	title: string;
	description: string;
	audioGuideId?: string;
}

export interface LandmarkUpdateRequest {
	title?: string;
	description?: string;
	audioGuideId?: string;
}

export interface LandmarksSearchParams {
	title?: string;
	page?: number;
	size?: number;
}

export interface PaginatedLandmarks {
	content: Landmark[];
	totalElements: number;
	totalPages: number;
	number: number;
}
