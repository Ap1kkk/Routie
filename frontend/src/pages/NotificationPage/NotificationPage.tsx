import React, { useEffect, useState } from 'react';

import { NotificationCard } from '@components';
import { FriendCard } from '@components';
import { Notification } from '../../types/Notification';
import { Friend } from '../../types/Friends';

import {
	getUnreadNotificationsApi,
	markAsReadApi,
	markAllAsReadApi,
} from '../../utils/api/NotificationsApi';

import {
	getFriendsApi,
	acceptFriendRequestApi,
	rejectFriendRequestApi,
} from '../../utils/api/FriendsApi';

import { downloadFileApi } from '../../utils/api/FileApi';

import styles from './NotificationPage.module.scss';
import { Button } from '@ui';

export const NotificationPage: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
	const [requestAvatars, setRequestAvatars] = useState<Record<string, string>>({});
	const [friendshipIds, setFriendshipIds] = useState<Record<string, string>>({}); // friendshipId по userId
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadNotifications = async () => {
			try {
				const response = await getUnreadNotificationsApi({
					page: 0,
					size: 50,
				});

				if (response.success && response.data) {
					const notifs = response.data.content || [];
					setNotifications(notifs);

					// Извлекаем friendshipId из payload уведомлений
					const idsMap: Record<string, string> = {};
					notifs.forEach((notif) => {
						if (notif.type === 'FRIEND_REQUEST_RECEIVED' && notif.payload) {
							try {
								const payload = JSON.parse(notif.payload);
								if (payload.friendshipId && payload.fromUserId) {
									idsMap[payload.fromUserId] = payload.friendshipId;
								}
							} catch (e) {
								console.error('Ошибка парсинга payload', e);
							}
						}
					});
					setFriendshipIds(idsMap);
				}
			} catch (err: any) {
				console.error(err);
			}
		};

		loadNotifications();
	}, []);

	useEffect(() => {
		const loadFriendRequests = async () => {
			try {
				const response = await getFriendsApi({
					status: 'PENDING',
					page: 0,
					size: 20,
				});

				if (response.success && response.data) {
					const requests = response.data.content || [];
					setFriendRequests(requests);
					loadRequestAvatars(requests);
				}
			} catch (err: any) {
				console.error('Ошибка загрузки заявок в друзья:', err);
			} finally {
				setLoading(false);
			}
		};

		loadFriendRequests();
	}, []);

	const loadRequestAvatars = async (requests: Friend[]) => {
		const avatars: Record<string, string> = { ...requestAvatars };

		for (const req of requests) {
			if (req.avatar?.id && !avatars[req.id]) {
				try {
					const result = await downloadFileApi(req.avatar.id);
					if (result.success && result.data) {
						avatars[req.id] = result.data;
					}
				} catch (err) {
					console.error(`Не удалось загрузить аватар для ${req.id}`, err);
				}
			}
		}

		setRequestAvatars(avatars);
	};

	const handleMarkAsRead = async (notificationId: string) => {
		try {
			const response = await markAsReadApi(notificationId);

			if (response.success) {
				setNotifications((prev) =>
					prev.filter((notif) => notif.id !== notificationId)
				);
			}
		} catch (err) {
			console.error('Ошибка при отметке уведомления:', err);
		}
	};

	const handleMarkAllAsRead = async () => {
		if (notifications.length === 0) return;

		try {
			const response = await markAllAsReadApi();
			if (response.success) {
				setNotifications([]);
			}
		} catch (err) {
			console.error('Ошибка при отметке всех уведомлений:', err);
		}
	};

	const handleAcceptRequest = async (userId: string) => {
		const friendshipId = friendshipIds[userId];
		if (!friendshipId) {
			console.error('Не найден friendshipId для пользователя', userId);
			return;
		}

		try {
			const response = await acceptFriendRequestApi(friendshipId);
			if (response.success) {
				setFriendRequests((prev) => prev.filter((f) => f.id !== userId));
			}
		} catch (err) {
			console.error('Ошибка принятия запроса:', err);
		}
	};

	const handleRejectRequest = async (userId: string) => {
		const friendshipId = friendshipIds[userId];
		if (!friendshipId) return;

		try {
			const response = await rejectFriendRequestApi(friendshipId);
			if (response.success) {
				setFriendRequests((prev) => prev.filter((f) => f.id !== userId));
			}
		} catch (err) {
			console.error('Ошибка отклонения запроса:', err);
		}
	};

	return (
		<section className={styles.container}>
			<div className={styles.headerMenu}>
				<h2 className={styles.headerTitle}>Уведомления</h2>
			</div>

			<div className={styles.notificationList}>
				<h3 className={styles.notificationTitle}>Заявки в друзья</h3>

				{friendRequests.length > 0 ? (
					friendRequests.map((request) => (
						<FriendCard
							key={request.id}
							friend={request}
							avatarSrc={requestAvatars[request.id]}
							variant='standard'
							showAddButton={true}
							showRemoveButton={true}
							onAddFriend={handleAcceptRequest}   // ← userId
							onRemove={handleRejectRequest}      // ← userId
						/>
					))
				) : (
					<div className={styles.empty}>Заявок в друзья пока нет</div>
				)}
			</div>

			<div className={styles.notificationList}>
				<div className={styles.notificationListHeader}>
					<h3 className={styles.notificationTitle}>Достижения</h3>
					<Button
						variant='primary'
						children='Прочитать все'
						className={styles.buttonWatchAll}
						onClick={handleMarkAllAsRead}
						disabled={notifications.length === 0}
					/>
				</div>

				{notifications.map((notification) => (
					<NotificationCard
						key={notification.id}
						notification={notification}
						onMarkAsRead={handleMarkAsRead}
					/>
				))}

				{!loading && notifications.length === 0 && (
					<div className={styles.empty}>
						У вас пока нет новых уведомлений
					</div>
				)}
			</div>
		</section>
	);
};