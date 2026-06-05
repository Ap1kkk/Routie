import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import {
	selectIsAuthenticated,
	selectUserRoles,
} from '../../../services/selectors/userSelectors';

type ProtectedRouteProps = {
	allowedRoles: string[];
};

export const ProtectedRoute  = ({ allowedRoles }: ProtectedRouteProps) => {
	const isAuth = useSelector(selectIsAuthenticated);
	const roles = useSelector(selectUserRoles);
	const location = useLocation();

	if (!isAuth) {
		return (
			<Navigate
				to='/login'
				state={{ from: location }}
				replace
			/>
		);
	}

	const hasRole = allowedRoles.some(role =>
		roles.includes(role)
	);

	if (hasRole) {
		return <Navigate to='/routie' replace />;
	}

	return <Outlet />;
};