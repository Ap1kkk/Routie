import { UUID } from './User';

export interface LoginRequest {
	email: string;
	password: string;
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
	name: string;
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

