import { Navigate } from 'react-router-dom';
import { useSelector } from '@store';
import {
	selectIsAuthenticated,
	selectUser,
} from '../../../services/selectors/userSelectors';

export const ProfileRedirect = () => {
	const user = useSelector(selectUser);
	const isAuth = useSelector(selectIsAuthenticated);

	if (!isAuth) return <Navigate to='/login' />;

	if (!user) return null;

	return <Navigate to={`/profile/${user.username}`} replace />;
};
