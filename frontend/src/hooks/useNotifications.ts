import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from '@store';
import {
	addNewNotification,
	fetchUnreadCount,
} from '../services/slices/notificationsSlice/notificationsSlice';

export const useNotifications = () => {
	const dispatch = useDispatch();
	const socketRef = useRef<WebSocket | null>(null);

	const connect = useCallback(() => {
		const token = localStorage.getItem('accessToken');
		if (!token) {
			console.warn('Нет токена для WebSocket');
			return;
		}

		const wsUrl = `wss://your-domain.com/ws?token=${token}`;
		// Если не сработает, попробуй:
		// const wsUrl = `wss://your-domain.com/ws/notifications?token=${token}`;

		console.log('Подключение к WebSocket:', wsUrl);

		socketRef.current = new WebSocket(wsUrl);

		socketRef.current.onopen = () => {
			console.log('🟢 WebSocket уведомлений успешно подключён');
		};

		socketRef.current.onmessage = (event) => {
			try {
				const notification = JSON.parse(event.data);
				console.log('Новое уведомление от сервера:', notification);

				dispatch(addNewNotification(notification));
				dispatch(fetchUnreadCount()); // обновляем счётчик непрочитанных
			} catch (err) {
				console.error('Ошибка обработки WebSocket сообщения:', err);
			}
		};

		socketRef.current.onerror = (error) => {
			console.error('❌ WebSocket ошибка:', error);
		};

		socketRef.current.onclose = (event) => {
			console.log(
				`🔴 WebSocket закрыт (код: ${event.code}). Переподключение через 3 секунды...`
			);
			setTimeout(connect, 3000);
		};
	}, [dispatch]);

	useEffect(() => {
		connect();

		return () => {
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, [connect]);
};
