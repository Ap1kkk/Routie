import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../../auth';
import { authApi } from '../../api/AuthApi';
import { useEffect, useState } from 'react';

type ProtectedRouteProps = {
	allowedRoles: string[];
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
	const [loading, setLoading] = useState(true);
	const [roles, setRoles] = useState<string[]>([]);

	useEffect(() => {
		if (!getAccessToken()) {
			setLoading(false);
			return;
		}

		let mounted = true;

		Promise.all([authApi.getUser(), authApi.getUserRoles()])
			.then(([userResult, rolesResult]) => {
				if (!mounted) return;

				if (!userResult.success) return;

				if (rolesResult.success && rolesResult.data) {
					setRoles(rolesResult.data.roles);
				}
			})
			.finally(() => {
				if (mounted) {
					setLoading(false);
				}
			});

		return () => {
			mounted = false;
		};
	}, []);

	if (!getAccessToken()) {
		return <Navigate to='/login' replace />;
	}

	if (loading) {
		return null;
	}

	const hasRole = allowedRoles.some((role) => roles.includes(role));

	if (!hasRole) {
		return <Navigate to='/routie' replace />;
	}

	return <Outlet />;
};