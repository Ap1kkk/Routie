import {
	API_SESSIONS_URL,
	API_URL,
	ApiResponse,
	getHeaders,
	handleResponse,
} from './Api';
import {
	FinishSessionRequest,
	ReachCheckpointRequest,
	Session,
	StartSessionRequest,
} from '../../types/Sessions';

export const startSessionApi = async (
	data: StartSessionRequest
): Promise<ApiResponse<Session>> => {
	const response = await fetch(`${API_URL}/${API_SESSIONS_URL}/start`, {
		method: 'POST',
		headers: getHeaders(true),
		body: JSON.stringify(data),
	});

	return handleResponse(response);
};

export const finishSessionApi = async (
	data: FinishSessionRequest
): Promise<ApiResponse<Session>> => {
	const response = await fetch(`${API_URL}/${API_SESSIONS_URL}/finish`, {
		method: 'POST',
		headers: getHeaders(true),
		body: JSON.stringify(data),
	});

	return handleResponse(response);
};

export const reachCheckpointApi = async (
	data: ReachCheckpointRequest
): Promise<ApiResponse<Session>> => {
	const response = await fetch(`${API_URL}/${API_SESSIONS_URL}/checkpoint`, {
		method: 'POST',
		headers: getHeaders(true),
		body: JSON.stringify(data),
	});

	return handleResponse(response);
};

export const sessionsApi = {
	start: startSessionApi,
	finish: finishSessionApi,
	reachCheckpoint: reachCheckpointApi,
}
