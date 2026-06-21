import { UUID } from './User';

export interface LoginRequest {
	email: string;
	password: string;
	deviceId: string;
	deviceName: string;
}

export interface LoginResponse {
	id: UUID;
	email: string;
	name: string;
	username: string;
	roles: string[];
}

export interface RegisterRequest {
	email: string;
	password: string;
	username: string;
	deviceId: string;
	deviceName: string;
}

export interface AuthTokensResponse {
	accessToken: string;
	tokenType: string;
	expiresIn: number;
	refreshToken: string;
}

export interface RegisterResponse extends AuthTokensResponse {
	// Может содержать дополнительную информацию о пользователе
}

export interface LoginResponseWithTokens extends AuthTokensResponse {
	user?: LoginResponse;
}

export interface RolesResponse {
	roles: string[];
}

export interface RefreshTokenRequest {
	refreshToken: string;
}

export interface LogoutRequest {
	accessToken?: string;
}

export interface ActiveSession {
	id: string;
	deviceId: string;
	deviceName: string;
	createdAt: string;
	lastUsedAt: string;
	expiresAt: string;
}

