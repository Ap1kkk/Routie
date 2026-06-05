import React, { useEffect, useState } from 'react';
import { Settings } from '@components';

import styles from './SettingsPage.module.scss';
import { useDispatch, useSelector } from '@store';
import { getMyProfile } from '../../services/slices/profileSlice/profileSlice';
import { downloadFileApi } from '../../utils/api/FileApi';

export const SettingsPage = () => {
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
		<Settings
			username={myProfile.username}
			name={myProfile.name}
			level={myProfile.currentLevel}
			avatar={avatarSrc}
		/>
	);
};
