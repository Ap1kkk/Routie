import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { selectIsAuthenticated } from '../../../services/selectors/userSelectors';

export const ProtectedRoute = () => {
	const isAuth = useSelector(selectIsAuthenticated);
	const location = useLocation();

	if (!isAuth) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	return <Outlet />;
};
