import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@ui';

import { FriendCard } from '@components';
import { ReactComponent as Search } from '../../assets/icons/search.svg';

import styles from './FindFriendPage.module.scss';
import { LeaderboardEntry } from '../../types/Gamification';
import { sendFriendRequestApi } from '../../utils/api/FriendsApi';
import { getFriendsLeaderboardApi } from '../../utils/api/Gamification';

export const FindFriendPage: React.FC = () => {
	const navigate = useNavigate();

	const [users, setUsers] = useState<LeaderboardEntry[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Загрузка пользователей
	useEffect(() => {
		const loadUsers = async () => {
			try {
				setLoading(true);
				const response = await getFriendsLeaderboardApi('WEEK', 50);

				if (response.success && response.data?.entries) {
					setUsers(response.data.entries);
				} else {
					setError(
						response.error?.message ||
							'Не удалось загрузить пользователей'
					);
				}
			} catch (err: any) {
				setError('Ошибка при загрузке пользователей');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadUsers();
	}, []);

	// Поиск
	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return users;
		const query = searchQuery.toLowerCase().trim();
		return users.filter((user) => user.name.toLowerCase().includes(query));
	}, [users, searchQuery]);

	const handleCardClick = (userId: string) => {
		navigate(`/profile/${userId}`);
	};

	const handleAddFriend = async (friendId: string) => {
		try {
			const response = await sendFriendRequestApi(friendId);
		} catch (err) {
			console.error(err);
			alert('Ошибка при отправке запроса');
		}
	};

	return (
		<section className={styles.container}>
			<div className={styles.headerMenu}>
				<h2 className={styles.headerTitle}>Найти друзей</h2>

				<Input
					className={styles.search}
					placeholder='Поиск по имени...'
					iconLeft={<Search />}
					inputPadding='5px 10px'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<div className={styles.userList}>
				{loading && (
					<div className={styles.loading}>
						Загрузка пользователей...
					</div>
				)}
				{error && <div className={styles.error}>{error}</div>}

				{!loading && !error && filteredUsers.length === 0 && (
					<div className={styles.empty}>Пользователи не найдены</div>
				)}

				{filteredUsers.map((user) => (
					<FriendCard
						key={user.userId}
						friend={{
							id: user.userId,
							name: user.name,
							currentLevel: user.currentLevel,
							totalXp: user.totalXp,
							isFriend: false,
						}}
						variant='standard'
						onCardClick={handleCardClick}
						onAddFriend={handleAddFriend} // ← добавили
						showAddButton={true}
						showRemoveButton={false}
					/>
				))}
			</div>
		</section>
	);
};



// Загрузка пользователей
// useEffect(() => {
// 	const loadUsers = async () => {
// 		try {
// 			setLoading(true);
// 			const response = await getUsersActivityApi({
// 				page: 0,
// 				size: 50,
// 			});
//
// 			if (response.success && response.data) {
// 				setUsers(response.data.content || []);
// 			} else {
// 				setError(response.error?.message || 'Не удалось загрузить пользователей');
// 			}
// 		} catch (err: any) {
// 			setError('Ошибка при загрузке пользователей');
// 			console.error(err);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};
//
// 	loadUsers();
// }, []);