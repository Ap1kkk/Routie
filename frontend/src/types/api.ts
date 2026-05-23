import { User, UserForAdmin } from './user';

export type TApiResponse = {
	success: boolean;
	data?: any;
	message?: string;
	user?: User;
	users?: UserForAdmin[];
	refreshToken?: string;
	accessToken?: string;
};
