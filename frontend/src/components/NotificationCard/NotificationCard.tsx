import React from 'react';
import { Blur } from '@ui';
import styles from './NotificationCard.module.scss';
import { ReactComponent as Done } from '../../assets/icons/done.svg';
import { Notification } from '../../types/Notification';

interface NotificationCardProps {
	notification: Notification;

	onClick?: (notification: Notification) => void;
	onMarkAsRead?: (notificationId: string) => void;

	showReadIcon?: boolean;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
	notification,
	onClick,
	onMarkAsRead,
	showReadIcon = true,
}) => {
	const handleClick = () => {
		onClick?.(notification);
	};

	const handleMarkAsRead = (e: React.MouseEvent) => {
		e.stopPropagation(); // предотвращаем клик по карточке
		onMarkAsRead?.(notification.id);
	};

	return (
		<Blur
			className={`${styles.standardCard} ${
				notification.isRead ? styles.read : styles.unread
			}`}
			onClick={handleClick}>
			<div className={styles.cardContent}>
				<h3 className={styles.cardTitle}>{notification.title}</h3>
				<span className={styles.cardBody}>{notification.body}</span>
			</div>

			<Done className={styles.readIcon} onClick={handleMarkAsRead} />
		</Blur>
	);
};
