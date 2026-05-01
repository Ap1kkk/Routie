export type UUIDCheckpoint = string;
export type UUIDAudioGuide = string;

export interface Checkpoint {
	id: UUIDCheckpoint;
	latitude: number;
	longitude: number;
	order: number;
	name?: string;
	description?: string;
}

export interface CheckpointImage {
	id: string;
	checkpoint_id: UUIDCheckpoint;
	image: string;
}

export interface AudioGuide {
	id: UUIDAudioGuide;
	checkpoint_id: UUIDCheckpoint;
	audioUrl: string;
	duration: number;
	createdAt: string;
	updatedAt?: string;
}
