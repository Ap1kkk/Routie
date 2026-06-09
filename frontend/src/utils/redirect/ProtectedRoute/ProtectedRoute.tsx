import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import {
	selectInitialized,
	selectIsAuthenticated,
	selectUserRoles,
} from '../../../services/selectors/userSelectors';

type ProtectedRouteProps = {
	allowedRoles: string[];
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
	const initialized = useSelector(selectInitialized);
	const isAuth = useSelector(selectIsAuthenticated);
	const roles = useSelector(selectUserRoles);

	const location = useLocation();

	if (!initialized) {
		return null;
	}

	if (!isAuth) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	const hasRole = allowedRoles.some((role) => roles.includes(role));

	if (!hasRole) {
		return <Navigate to='/routie' replace />;
	}

	return <Outlet />;
};