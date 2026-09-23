import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../../api/AuthApi';

export const ProfileRedirect = () => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		let mounted = true;

		authApi.getUser().then((result) => {
			if (!mounted) return;

			if (result.success) {
				setUser(result.data);
			}

			setLoading(false);
		});

		return () => {
			mounted = false;
		};
	}, []);

	if (loading) {
		return null;
	}

	if (!user) {
		return <Navigate to='/login' replace />;
	}

	return <Navigate to={`/profile/${user.username}`} replace />;
};
