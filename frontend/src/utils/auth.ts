import { deleteCookie, getCookie, setCookie } from './cookie';

export const getAccessToken = () => localStorage.getItem('accessToken');

export const getRefreshToken = () => getCookie('refreshToken');

export const hasTokens = () => !!getAccessToken() && !!getRefreshToken();

export const storeTokens = (accessToken: string, refreshToken: string) => {
	localStorage.setItem('accessToken', accessToken);

	setCookie('refreshToken', refreshToken, {
		expires: 60 * 60 * 24 * 30,
		path: '/',
	});
};

export const clearTokens = () => {
	localStorage.removeItem('accessToken');
	deleteCookie('refreshToken');
};
