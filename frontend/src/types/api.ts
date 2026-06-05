import { User } from './user';

export type TApiResponse = {
	success: boolean;
	data?: any;
	message?: string;
	user?: User;
	refreshToken?: string;
	accessToken?: string;
};
