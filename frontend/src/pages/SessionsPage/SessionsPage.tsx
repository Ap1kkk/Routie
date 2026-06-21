import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '@store';
import {
	fetchActiveSessions,
	terminateSession,
} from '../../services/slices/authSlice/authSlice';
import { getDeviceId } from '../../utils/UserAgent';
import styles from './SessionsPage.module.scss'

import { Sessions } from '../../components/Sessions/Sessions';

export const SessionsPage: React.FC = () => {
	const dispatch = useDispatch();

	const { activeSessions, sessionsLoading, sessionsError } = useSelector(
		(state) => state.auth
	);

	const currentDeviceId = getDeviceId();

	useEffect(() => {
		dispatch(fetchActiveSessions());
	}, [dispatch]);

	const handleTerminateSession = (deviceId: string) => {
		dispatch(terminateSession(deviceId));
	};

	return (
		<div className={styles.container}>
			{sessionsLoading && <p>Загрузка сессий...</p>}
			{sessionsError && (
				<p className={styles.error}>Ошибка: {sessionsError}</p>
			)}

			<Sessions
				sessionsData={activeSessions}
				currentDeviceId={currentDeviceId}
				onTerminateSession={handleTerminateSession}
			/>
		</div>
	);
};
