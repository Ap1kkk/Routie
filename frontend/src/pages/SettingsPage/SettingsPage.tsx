import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';

import { getMyProfile } from '../../services/slices/profileSlice/profileSlice';
import {
	logout,
	fetchActiveSessions,
	terminateSession,
	resetAuthState,
} from '../../services/slices/authSlice/authSlice';
import { downloadFileApi } from '../../utils/api/FileApi';
import { clearTokens } from '../../utils/auth';

import { Settings } from '@components';

import styles from './SettingsPage.module.scss';

export const SettingsPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		myProfile,
		loading: profileLoading,
		error: profileError,
	} = useSelector((state) => state.profile);
	const { activeSessions } = useSelector((state) => state.auth);

	const [avatarSrc, setAvatarSrc] = useState<string>();

	useEffect(() => {
		dispatch(getMyProfile());
		dispatch(fetchActiveSessions());
	}, [dispatch]);

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

	// Улучшенный выход из аккаунта
	const handleLogout = async () => {
		try {
			await dispatch(logout()).unwrap();
		} catch (err) {
			console.error('Ошибка logout на сервере:', err);
		} finally {
			clearTokens();
			localStorage.clear();
			sessionStorage.clear();

			dispatch(resetAuthState());
			window.location.href = '/login';
		}
	};

	const handleTerminateSession = (deviceId: string) => {
		console.log('Завершить сессию:', deviceId);
		dispatch(terminateSession(deviceId));
	};

	if (profileLoading) {
		return <section className={styles.section}>Загрузка...</section>;
	}

	if (profileError) {
		return (
			<section className={styles.section}>Ошибка: {profileError}</section>
		);
	}

	return (
		<section className={styles.section}>
			<Settings
				username={myProfile?.username}
				name={myProfile?.name}
				level={myProfile?.currentLevel}
				avatar={avatarSrc}
				activeSessions={activeSessions}
				onLogout={handleLogout}
				onTerminateSession={handleTerminateSession}
			/>
		</section>
	);
};
