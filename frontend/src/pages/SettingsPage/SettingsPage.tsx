import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';

import { getMyProfile } from '../../services/slices/profileSlice/profileSlice';
import {
	logout,
	fetchActiveSessions,
} from '../../services/slices/authSlice/authSlice';
import { downloadFileApi } from '../../utils/api/FileApi';

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
	const { activeSessions, sessionsLoading, sessionsError } = useSelector(
		(state) => state.auth
	);

	const [avatarSrc, setAvatarSrc] = useState<string>();

	// Загрузка профиля и сессий
	useEffect(() => {
		dispatch(getMyProfile());
		dispatch(fetchActiveSessions());
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

	const handleLogout = async () => {
		await dispatch(logout()).unwrap();
		navigate('/login', { replace: true });
	};

	const handleTerminateSession = (sessionId: string) => {
		// Пока просто заглушка. Позже можно добавить thunk terminateSession
		console.log('Завершить сессию:', sessionId);
		// dispatch(terminateSession(sessionId));
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
