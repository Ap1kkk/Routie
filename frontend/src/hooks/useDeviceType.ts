import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'desktop';

export const useDeviceType = () => {
	const getInitialDeviceType = (): DeviceType => {
		if (typeof window !== 'undefined') {
			return window.innerWidth <= 925 ? 'mobile' : 'desktop';
		}
		return 'desktop';
	};

	const [deviceType, setDeviceType] =
		useState<DeviceType>(getInitialDeviceType);

	useEffect(() => {
		const checkDevice = () => {
			const width = window.innerWidth;
			setDeviceType(width <= 925 ? 'mobile' : 'desktop');
		};

		checkDevice();
		window.addEventListener('resize', checkDevice);
		return () => window.removeEventListener('resize', checkDevice);
	}, []);

	return deviceType;
};
