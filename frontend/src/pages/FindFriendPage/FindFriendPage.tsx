import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@ui';

import { FriendCard } from '@components';
import { ReactComponent as Search } from '../../assets/icons/search.svg';

import styles from './FindFriendPage.module.scss';
import { PaginatedFriends, Friend } from '../../types/Friends';
import { searchUsersApi } from '../../utils/api/FriendsApi';
import { sendFriendRequestApi } from '../../utils/api/FriendsApi';
import { downloadFileApi } from '../../utils/api/FileApi';

export const FindFriendPage: React.FC = () => {
	const navigate = useNavigate();

	const [users, setUsers] = useState<Friend[]>([]);
	const [avatarUrls, setAvatarUrls] = useState<Record<string, string>>({});
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	useEffect(() => {
		const loadUsers = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await searchUsersApi({
					query: debouncedQuery || undefined,
					page: 0,
					size: 50,
				});

				if (response.success && response.data) {
					setUsers(response.data.content || []);
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
	}, [debouncedQuery]);

	useEffect(() => {
		const loadAvatars = async () => {
			const newAvatarUrls: Record<string, string> = { ...avatarUrls };

			for (const user of users) {
				if (user.avatar?.id && !newAvatarUrls[user.id]) {
					try {
						const result = await downloadFileApi(user.avatar.id);
						if (result.success && result.data) {
							newAvatarUrls[user.id] = result.data;
						}
					} catch (err) {
						console.error(
							`Не удалось загрузить аватар для ${user.id}`,
							err
						);
					}
				}
			}

			setAvatarUrls(newAvatarUrls);
		};

		if (users.length > 0) {
			loadAvatars();
		}
	}, [users]);

	const handleCardClick = (userId: string) => {
		navigate(`/profile/${userId}`);
	};

	const handleAddFriend = async (friendId: string) => {
		try {
			const response = await sendFriendRequestApi(friendId);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<section className={styles.container}>
			<div className={styles.headerMenu}>
				<h2 className={styles.headerTitle}>Найти друзей</h2>

				<Input
					className={styles.search}
					placeholder='Поиск по имени или username...'
					iconLeft={<Search />}
					inputPadding='5px 10px'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<div className={styles.userList}>
				{error && <div className={styles.error}>{error}</div>}

				{!loading && !error && users.length === 0 && (
					<div className={styles.empty}>
						{searchQuery
							? 'Пользователи не найдены'
							: 'Начните поиск'}
					</div>
				)}

				{users.map((user) => (
					<FriendCard
						key={user.id}
						friend={user}
						variant='standard'
						onCardClick={handleCardClick}
						onAddFriend={handleAddFriend}
						showAddButton={true}
						showRemoveButton={false}
						avatarSrc={avatarUrls[user.id]}
					/>
				))}
			</div>
		</section>
	);
};
