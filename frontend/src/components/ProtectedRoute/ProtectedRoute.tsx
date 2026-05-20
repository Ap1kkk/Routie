import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
	isAuthenticated: boolean;
	userRole?: 'USER' | 'ADMIN';
	allowedRoles?: ('USER' | 'ADMIN')[];
	redirectPath?: string;
}

export const ProtectedRoute = ({
	isAuthenticated,
	userRole,
	allowedRoles,
	redirectPath = '/login',
}: ProtectedRouteProps) => {
	if (!isAuthenticated) {
		return <Navigate to={redirectPath} replace />;
	}

	if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
		return <Navigate to='/routie' replace />;
	}

	return <Outlet />;
};
