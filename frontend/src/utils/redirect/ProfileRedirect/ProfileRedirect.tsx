import { Navigate } from 'react-router-dom';
import { useSelector } from '@store';
import { selectUser } from '../../../services/selectors/userSelectors';

export const ProfileRedirect = () => {
	const user = useSelector(selectUser);
	return user?.username ? (
		<Navigate to={`/profile/${user.username}`} replace />
	) : (
		<Navigate to='/login' />
	);
};
