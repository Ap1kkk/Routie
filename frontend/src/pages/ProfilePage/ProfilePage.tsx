import {
	MOCK_USER,
	MOCK_USER_AVATAR,
	MOCK_USER_FRIENDS,
	MOCK_USER_ROUTES_HISTORY,
} from '../../mocks/users';
import { Profile } from '@components';
import { getRouteImage } from '../../mocks/route';

import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
	const recentRoutesWithImages = MOCK_USER_ROUTES_HISTORY.historyRoutes.map(
		(route) => ({
			...route,
			imagePath: getRouteImage(route.id) || '/placeholder-image.jpg',
		})
	);

	return (
		<section className={styles.section}>
			<Profile
				username={MOCK_USER.username}
				name={MOCK_USER.name}
				email={MOCK_USER.email}
				phone={MOCK_USER.number}
				avatar={MOCK_USER_AVATAR.avatar}
				level={MOCK_USER.level}
				birthday={MOCK_USER.birthday}
				friends={MOCK_USER_FRIENDS.friends.map((friend) => ({
					id: friend.id,
					name: friend.name,
					avatar: friend.avatar || '/default-avatar.jpg',
				}))}
				recentRoutes={recentRoutesWithImages.map((route) => ({
					id: route.id,
					name: route.name,
					distance: route.distance,
					imagePath: route.imagePath,
					checkpoints: route.checkpoints,
					tags: route.tags,
				}))}
			/>
		</section>
	);
};
