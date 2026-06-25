import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';

import { Profile } from '@components';
import { getMyProfile } from '../../services/slices/profileSlice/profileSlice';
import { fetchFriends, removeFriend } from '../../services/slices/friendsSlice/friendsSlice';
import { downloadFileApi } from '../../utils/api/FileApi';
import { sendFriendRequestApi } from '../../utils/api/FriendsApi';

import styles from './ProfilePage.module.scss';
import { Friend } from '../../types/Friends';

export const ProfilePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { myProfile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
	const { friendsList, isLoading: friendsLoading } = useSelector((state) => state.friends);

	const [avatarSrc, setAvatarSrc] = useState<string>();

	// Моковый друг для тестирования
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
		dispatch(fetchFriends({ page: 0, size: 20 }));
	}, [dispatch]);

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
			/>
		</section>
	);
};