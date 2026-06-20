import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';

import { Profile } from '@components';
import { getMyProfile } from '../../services/slices/profileSlice/profileSlice';
import { fetchFriends, removeFriend } from '../../services/slices/friendsSlice/friendsSlice';
import { downloadFileApi } from '../../utils/api/FileApi';

import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { myProfile, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
	const { friendsList, isLoading: friendsLoading, error: friendsError } = useSelector((state) => state.friends);

	const [avatarSrc, setAvatarSrc] = useState<string>();

	// Загрузка профиля
	useEffect(() => {
		dispatch(getMyProfile());
	}, [dispatch]);

	// Загрузка списка друзей
	useEffect(() => {
		dispatch(fetchFriends({
			page: 0,
			size: 20,
			//status: 'FRIENDS'   // только подтверждённые друзья
		}));
	}, [dispatch]);

	// Загрузка аватара
	useEffect(() => {
		const loadAvatar = async () => {
			if (!myProfile?.avatar?.id) return;
			try {
				const avatar = await downloadFileApi(myProfile.avatar.id);
				setAvatarSrc(avatar);
			} catch (error) {
				console.error('Ошибка загрузки аватара', error);
			}
		};

		loadAvatar();
	}, [myProfile]);

	const handleRemoveFriend = (friendId: string) => {
		if (window.confirm('Удалить друга из списка?')) {
			dispatch(removeFriend(friendId));
		}
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

				// Передаём друзей и обработчики
				friends={friendsList?.content || []}
				onRemoveFriend={handleRemoveFriend}
				onFriendClick={handleFriendClick}
			/>
		</section>
	);
};