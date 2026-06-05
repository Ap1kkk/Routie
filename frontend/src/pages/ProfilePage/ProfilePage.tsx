import React, { useEffect, useState } from 'react';
import { Profile } from '@components';

import styles from './ProfilePage.module.scss';

import { useDispatch, useSelector } from '@store';
import {
	getMyProfile,
	getUserProfile,
} from '../../services/slices/profileSlice/profileSlice';
import { downloadFileApi } from '../../utils/api/FileApi';

const TEST_USER_ID = '32228023-8dab-4616-b5b7-37866753b8d2';

export const ProfilePage = () => {
	const dispatch = useDispatch();

	const { myProfile, loading, error } = useSelector(
		(state) => state.profile
	);

	const [avatarSrc, setAvatarSrc] = useState<string>();

	useEffect(() => {
		dispatch(getMyProfile());
	}, [dispatch]);

	useEffect(() => {
		const loadAvatar = async () => {
			if (!myProfile?.avatar?.id) return;

			try {
				const avatar = await downloadFileApi(myProfile.avatar.id);

				setAvatarSrc(avatar);
				console.log('avatar url', avatar);
			} catch (error) {
				console.error('Ошибка загрузки аватара', error);
			}
		};

		loadAvatar();
	}, [myProfile]);

	if (loading) {
		return (
			<section className={styles.section}>
				<div>Загрузка профиля...</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className={styles.section}>
				<div>Ошибка: {error}</div>
			</section>
		);
	}

	if (!myProfile) {
		return (
			<section className={styles.section}>
				<div>Профиль не найден</div>
			</section>
		);
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
			/>
		</section>
	);
};
