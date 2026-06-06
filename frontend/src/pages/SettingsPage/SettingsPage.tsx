import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';

import { getMyProfile } from '../../services/slices/profileSlice/profileSlice';
import { logout } from '../../services/slices/userSlice/userSlice'; // ← добавь импорт
import { downloadFileApi } from '../../utils/api/FileApi';

import { Settings } from '@components';

import styles from './SettingsPage.module.scss';

export const SettingsPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { myProfile, loading, error } = useSelector((state) => state.profile);

	const [avatarSrc, setAvatarSrc] = useState<string>();

	useEffect(() => {
		dispatch(getMyProfile());
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

	// Выход из аккаунта
	const handleLogout = async () => {
		await dispatch(logout()).unwrap(); // вызов thunk
		navigate('/login', { replace: true }); // или '/' — куда хочешь перенаправить
	};

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
			onLogout={handleLogout} // ← передаём обработчик
		/>
	);
};
