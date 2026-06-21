import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '@store';

import {
	fetchActiveSessions,
	terminateSession,
} from '../../services/slices/authSlice/authSlice';
import { Sessions } from '../../components/Sessions/Sessions';

import styles from './SessionsPage.module.scss';

export const SessionsPage: React.FC = () => {
	const dispatch = useDispatch();

	const { activeSessions, sessionsLoading, sessionsError } = useSelector(
		(state) => state.auth
	);

	useEffect(() => {
		dispatch(fetchActiveSessions());
	}, [dispatch]);

	const handleTerminateSession = (deviceId: string) => {
		if (window.confirm(`Завершить сессию для устройства ${deviceId}?`)) {
			dispatch(terminateSession(deviceId));
		}
	};

	return (
		<div className={styles.container}>
			{sessionsLoading && <p>Загрузка сессий...</p>}
			{sessionsError && (
				<p className={styles.error}>Ошибка: {sessionsError}</p>
			)}

			<Sessions
				sessionsData={activeSessions}
				onTerminateSession={handleTerminateSession}
			/>
		</div>
	);
};
