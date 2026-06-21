import React from 'react';
import styles from './Sessions.module.scss';
import { SessionCard } from '../SessionCard';
import { ActiveSession } from '../../types/Auth';

interface SessionsProps {
	sessionsData?: ActiveSession[];
	onTerminateSession?: (sessionId: string) => void;
}

export const Sessions: React.FC<SessionsProps> = ({
	sessionsData = [],
	onTerminateSession,
}) => {
	return (
		<div className={styles.container}>
			<h2 className={styles.sessionsTitle}>Активные сессии</h2>

			{sessionsData.length === 0 ? (
				<p className={styles.emptyText}>Активных сессий не найдено</p>
			) : (
				<div className={styles.sessionsContent}>
					{sessionsData.map((session, index) => (
						<SessionCard
							key={session.id}
							number={index + 1}
							deviceName={session.deviceName}
							deviceId={session.deviceId}
							lastUsedAt={session.lastUsedAt}
							isCurrent={index === 0}
							disableTerminate={index === 0}
							onTerminate={() =>
								onTerminateSession?.(session.deviceId)
							}
						/>
					))}
				</div>
			)}
		</div>
	);
};
