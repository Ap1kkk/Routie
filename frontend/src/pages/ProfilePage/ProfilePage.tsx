import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';
import { Friend } from '../../types/Friends';
import { sessionsApi } from '../../utils/api/SessionApi';
import { Session } from '../../types/Sessions';
import { Profile } from '@components';
import { getMyProfile } from '../../services/slices/profileSlice/profileSlice';
import {
	fetchFriends,
	removeFriend,
} from '../../services/slices/friendsSlice/friendsSlice';
import { downloadFileApi, fileApi } from '../../utils/api/FileApi';
import { sendFriendRequestApi } from '../../utils/api/FriendsApi';

import styles from './ProfilePage.module.scss';
import { Route } from '../../types/Route';
import { routeApi } from '../../utils/api/RoutesApi';

export const ProfilePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { myProfile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
	const { friendsList, isLoading: friendsLoading } = useSelector((state) => state.friends);

	const [avatarSrc, setAvatarSrc] = useState<string>();
	const [recentRoutes, setRecentRoutes] = useState<Route[]>([]);
	const [routeImages, setRouteImages] = useState<Record<string, string>>({});

	const mockFriend: Friend = {
		id: "mock-friend-123",
		name: "Анна Смирнова",
		currentLevel: 42,
		totalXp: 18750,
		isFriend: false,
	};

	useEffect(() => {
		dispatch(getMyProfile());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchFriends({ status: "ACCEPTED", page: 0, size: 20 }));
	}, [dispatch]);

	useEffect(() => {
		const loadRecentRoutes = async () => {
			const history = await sessionsApi.getHistory({
				status: 'FINISHED',
				page: 0,
				size: 15,
			});

			if (!history.success || !history.data) return;

			const routeIds = history.data.content.map(
				(session) => session.routeId
			);

			const routes = await Promise.all(
				routeIds.map(async (id) => {
					const response = await routeApi.get(id);

					return response.success ? response.data : null;
				})
			);

			const validRoutes = routes.filter(
				(route): route is Route => route !== null
			);

			setRecentRoutes(validRoutes);

			const images = await Promise.all(
				validRoutes.map(async (route) => {
					if (!route.images?.length) {
						return [route.id, ''];
					}

					try {
						const response = await fileApi.download(
							route.images[0].id
						);

						return [
							route.id,
							response.success && response.data
								? response.data
								: '',
						] as const;
					} catch {
						return [route.id, ''] as const;
					}
				})
			);

			setRouteImages(Object.fromEntries(images));
		};

		loadRecentRoutes();
	}, []);

	useEffect(() => {
		const loadAvatar = async () => {
			if (!myProfile?.avatar?.id) return;
			try {
				const response = await downloadFileApi(myProfile.avatar.id);
				if (response.success && response.data) {
					setAvatarSrc(response.data);
				}
			} catch (error) {
				console.error('Ошибка загрузки аватара', error);
			}
		};
		loadAvatar();
	}, [myProfile]);

	const handleRemoveFriend = (friendId: string) => {
		dispatch(removeFriend(friendId));
	};

	const handleFriendClick = (friendId: string) => {
		navigate(`/profile/${friendId}`);
	};

	if (profileLoading) {
		return <section className={styles.section}><div>Загрузка профиля...</div></section>;
	}

	if (profileError) {
		return <section className={styles.section}><div>Ошибка профиля: {profileError}</div></section>;
	}

	if (!myProfile) {
		return <section className={styles.section}><div>Профиль не найден</div></section>;
	}

	return (
		<section className={styles.section}>
			<Profile
				username={`@${myProfile.username}`}
				name={myProfile.name}
				email={myProfile.email}
				level={myProfile.currentLevel}
				routesCounter={myProfile.totalRoutesCompleted}
				birthday={myProfile.dateOfBirth}
				avatar={avatarSrc}
				friends={friendsList?.content?.length ? friendsList.content : [mockFriend]}
				onRemoveFriend={handleRemoveFriend}
				onFriendClick={handleFriendClick}
				recentRoutes={recentRoutes}
				routeImages={routeImages}
			/>
		</section>
	);
};