import React from 'react';
import { Button } from '@ui';
import styles from './SessionCard.module.scss';

interface SessionCardProps {
	number?: number;
	deviceName: string;
	deviceId?: string;
	lastUsedAt: string;
	isCurrent?: boolean;
	onTerminate?: () => void;
	disableTerminate?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
	number,
	deviceName,
	deviceId,
	lastUsedAt,
	isCurrent = false,
	onTerminate,
	disableTerminate = false,
}) => {
	const formattedDate = new Date(lastUsedAt).toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<article
			className={`${styles.sessionCard} ${
				isCurrent ? styles.current : ''
			}`}>
			<div className={styles.sessionContent}>
				{number && (
					<span className={styles.sessionNumber}>{number}</span>
				)}

				<div className={styles.sessionInfo}>
					<span className={styles.sessionDevice}>
						{deviceName}
						{isCurrent && (
							<span className={styles.currentBadge}>
								{' '}
								(текущая)
							</span>
						)}
					</span>
					<span className={styles.sessionLastUsed}>
						Последний вход: {formattedDate}
					</span>
				</div>
			</div>

			<div className={styles.sessionButton}>
				<Button
					children='Завершить'
					variant='primary'
					disabled={disableTerminate}
					onClick={onTerminate}
				/>
			</div>
		</article>
	);
};
