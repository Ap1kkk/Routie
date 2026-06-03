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

export interface AudioGuideCreateRequest {
	title: string;
	durationSeconds: number;
}

export interface AudioGuideUpdateRequest {
	title?: string;
	durationSeconds?: number;
}

export interface AudioGuidesSearchParams {
	title?: string;
	page?: number;
	size?: number;
}

export interface PaginatedAudioGuides {
	content: AudioGuide[];
	totalElements: number;
	totalPages: number;
	number: number;
}
