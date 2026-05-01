import { Route } from './route';
import { Tags } from './tags';

export type UUID = string;

export interface User {
	id: UUID;
	username: string;
	name: string;
	email: string;
	number: string;
	level: number;
	gender: 'male' | 'female' | 'other';
	height: number;
	weight: number;
	birthday: string;
	password: string;
	isAuthenticated: boolean;
}

export interface AvatarUser {
	id: string;
	user_id: UUID;
	avatar: string;
}

export interface UserTags {
	user_id: UUID;
	tags: Tags[];
}

export interface RoleUser {
	user_id: UUID;
	role: 'USER' | 'ADMIN';
}

export interface Friend {
	id: UUID;
	username: string;
	name: string;
	avatar?: string;
}

export interface FriendsUser {
	user_id: UUID;
	friends: Friend[];
}

export interface RoutesHistoryUser {
	user_id: UUID;
	historyRoutes: Route[];
}

export interface TLoginData {
	email: string;
	password: string;
}

export interface TRegisterData {
	username: string;
	email: string;
	password: string;
	name?: string;
	number?: string;
	gender?: 'male' | 'female' | 'other';
	height?: number;
	weight?: number;
	birthday?: string;
	role?: 'USER' | 'ADMIN';
}

export interface TUpdateUserData {
	name?: string;
	username?: string;
	number?: string;
	gender?: 'male' | 'female' | 'other';
	height?: number;
	weight?: number;
	birthday?: string;
	level?: number;
	avatar?: string;
	password?: string;
}

export interface UserSession {
	userId: UUID;
	accessToken: string;
	refreshToken: string;
	expiresAt: string;
}
