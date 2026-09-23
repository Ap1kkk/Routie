export type SessionStatus = 'ACTIVE' | 'FINISHED' | 'ABORTED';

export interface SessionCheckpoint {
	checkpointId: string;
	reachedAt: string;
	avgSpeedKmh: number;
}

export interface Session {
	id: string;
	routeId: string;
	userId: string;
	status: SessionStatus;
	startedAt: string;
	finishedAt: string | null;
	totalDurationSeconds: number;
	totalDistanceMeters: number;
	avgSpeedKmh: number;
	checkpoints: SessionCheckpoint[];
}

export interface StartSessionRequest {
	routeId: string;
}

export interface FinishSessionRequest {
	sessionId: string;
	status: Extract<SessionStatus, 'FINISHED' | 'ABORTED'>;
	totalDistanceMeters: number;
}

export interface ReachCheckpointRequest {
	sessionId: string;
	checkpointId: string;
	avgSpeedKmh: number;
}

export interface AbortSessionRequest {
	totalDistanceMeters: number;
}

export interface SessionHistoryParams {
	status?: SessionStatus;
	routeId?: string;
	page?: number;
	size?: number;
}

export interface SessionHistoryResponse {
	content: Session[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}
