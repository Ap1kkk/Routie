import { Route } from './Route';
import { Tags } from './Tags';

export interface User {
	id: string;
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
	user_id: string;
	avatar: string;
}

export interface UserTags {
	user_id: string;
	tags: Tags[];
}

export interface RoleUser {
	user_id: string;
	role: 'USER' | 'ADMIN';
}

export interface Friend {
	id: string;
	username: string;
	name: string;
	avatar?: string;
}

export interface FriendsUser {
	user_id: string;
	friends: Friend[];
}

export interface RoutesHistoryUser {
	user_id: string;
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
	userId: string;
	accessToken: string;
	refreshToken: string;
	expiresAt: string;
}
