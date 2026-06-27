import {
	API_SESSIONS_URL,
	API_URL,
	ApiResponse,
	getHeaders,
	handleResponse,
} from './Api';
import {
	AbortSessionRequest,
	FinishSessionRequest,
	ReachCheckpointRequest,
	Session,
	SessionHistoryParams,
	SessionHistoryResponse,
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

export const abortSessionApi = async (
	data: AbortSessionRequest = { totalDistanceMeters: 0 }
): Promise<ApiResponse<Session>> => {
	const response = await fetch(`${API_URL}/${API_SESSIONS_URL}/abort`, {
		method: 'POST',
		headers: getHeaders(true),
		body: JSON.stringify(data),
	});

	return handleResponse(response);
};

export const getActiveSessionApi = async (): Promise<ApiResponse<Session | null>> => {
	const response = await fetch(`${API_URL}/${API_SESSIONS_URL}/active`, {
		method: 'GET',
		headers: getHeaders(true),
	});

	return handleResponse(response);
};

export const getSessionHistoryApi = async (
	params: SessionHistoryParams = {}
): Promise<ApiResponse<SessionHistoryResponse>> => {
	const queryParams = new URLSearchParams();

	if (params.status) queryParams.append('status', params.status);
	if (params.routeId) queryParams.append('routeId', params.routeId);
	if (params.page !== undefined) queryParams.append('page', params.page.toString());
	if (params.size !== undefined) queryParams.append('size', params.size.toString());

	const url = queryParams.toString()
		? `${API_URL}/${API_SESSIONS_URL}/history?${queryParams.toString()}`
		: `${API_URL}/${API_SESSIONS_URL}/history`;

	const response = await fetch(url, {
		method: 'GET',
		headers: getHeaders(true),
	});

	return handleResponse(response);
};

export const sessionsApi = {
	start: startSessionApi,
	finish: finishSessionApi,
	reachCheckpoint: reachCheckpointApi,
	abort: abortSessionApi,
	getActive: getActiveSessionApi,
	getHistory: getSessionHistoryApi,
};
