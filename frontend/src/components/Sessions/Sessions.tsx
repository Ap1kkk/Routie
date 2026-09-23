import React from 'react';
import styles from './Sessions.module.scss';
import { SessionCard } from '../SessionCard';
import { ActiveSession } from '../../types/Auth';

interface SessionsProps {
	sessionsData?: ActiveSession[];
	currentDeviceId?: string; // ← новое проп
	onTerminateSession?: (deviceId: string) => void;
}

export const Sessions: React.FC<SessionsProps> = ({
	sessionsData = [],
	currentDeviceId,
	onTerminateSession,
}) => {
	return (
		<div className={styles.container}>
			<h2 className={styles.sessionsTitle}>Активные сессии</h2>

			{sessionsData.length === 0 ? (
				<p className={styles.emptyText}>Активных сессий не найдено</p>
			) : (
				<div className={styles.sessionsContent}>
					{sessionsData.map((session, index) => {
						const isCurrent = session.deviceId === currentDeviceId;

						return (
							<SessionCard
								key={session.id}
								number={index + 1}
								deviceName={session.deviceName}
								deviceId={session.deviceId}
								lastUsedAt={session.lastUsedAt}
								isCurrent={isCurrent}
								disableTerminate={isCurrent} // нельзя завершать текущую
								onTerminate={() =>
									onTerminateSession?.(session.deviceId)
								}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
