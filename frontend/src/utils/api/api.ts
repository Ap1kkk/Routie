export const getAccessToken = (): string | null => {
	const cookies = document.cookie.split(';');
	const accessTokenCookie = cookies.find((cookie) =>
		cookie.trim().startsWith('accessToken=')
	);
	return accessTokenCookie ? accessTokenCookie.split('=')[1] : null;
};

export const getHeaders = (withAuth: boolean = false): HeadersInit => {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	if (withAuth) {
		const token = getAccessToken();
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
	}
	return headers;
};

export const handleResponse = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.message || `HTTP error! status: ${response.status}`
		);
	}

	if (response.status === 204) {
		return {} as T;
	}

	return await response.json();
};

export const setAccessToken = (token: string): void => {
	document.cookie = `accessToken=${token}; path=/; max-age=3600; SameSite=Lax`;
};

export const removeAccessToken = (): void => {
	document.cookie = 'accessToken=; path=/; max-age=0';
};

export const saveSession = (
	accessToken: string,
	refreshToken: string
): void => {
	setAccessToken(accessToken);
	localStorage.setItem('refreshToken', refreshToken);
};

export const clearSession = (): void => {
	removeAccessToken();
	localStorage.removeItem('refreshToken');
};

export const getRefreshToken = (): string | null => {
	return localStorage.getItem('refreshToken');
};
