const DEVICE_ID_KEY = 'device_id';

export const getDeviceId = (): string => {
	let id = localStorage.getItem(DEVICE_ID_KEY);

	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(DEVICE_ID_KEY, id);
	}

	return id;
};

export const getDeviceName = (): string => {
	const ua = navigator.userAgent.toLowerCase();

	// iOS
	if (/iphone|ipad|ipod/.test(ua)) {
		return 'iOS';
	}

	// Android
	if (/android/.test(ua)) {
		return 'Android';
	}

	// Mac
	if (/macintosh/.test(ua)) {
		return 'MacOS';
	}

	// Windows
	if (/windows/.test(ua)) {
		return 'Windows';
	}

	// Linux
	if (/linux/.test(ua)) {
		return 'Linux';
	}

	// fallback браузеры
	if (ua.includes('chrome') && !ua.includes('edg')) {
		return 'Chrome';
	}

	if (ua.includes('safari') && !ua.includes('chrome')) {
		return 'Safari';
	}

	if (ua.includes('firefox')) {
		return 'Firefox';
	}

	if (ua.includes('edg')) {
		return 'Edge';
	}

	return 'Unknown';
};
