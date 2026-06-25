import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';

import { FriendCard } from '@components';
import { Friend } from '../../types/Friends';
import { fetchFriends, removeFriend } from '../../services/slices/friendsSlice/friendsSlice';
import { sendFriendRequestApi } from '../../utils/api/FriendsApi';

import styles from './FriendPage.module.scss';
import { Button, Input } from '@ui';

import { ReactComponent as Search } from '../../assets/icons/search.svg';
import { ReactComponent as Dumbels } from '../../assets/icons/dumbells.svg';
import { ReactComponent as User } from '../../assets/icons/user.svg';

export const FriendsPage: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { friendsList, isLoading, error } = useSelector((state) => state.friends);

	const [searchValue, setSearchValue] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	const realFriends = friendsList?.content || [];

	const mockFriend: Friend = {
		id: "mock-friend-001",
		name: "Екатерина Морозова",
		currentLevel: 37,
		totalXp: 15420,
		isFriend: false,
	};

	const allFriends = [...realFriends, mockFriend];

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchValue);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchValue]);

	useEffect(() => {
		dispatch(fetchFriends({
			page: 0,
			size: 50,
			search: debouncedSearch || undefined,
		}));
	}, [dispatch, debouncedSearch]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleCardClick = (friendId: string) => {
		navigate(`/profile/${friendId}`);
	};

	const handleRemove = useCallback((friendId: string) => {
		dispatch(removeFriend(friendId));
	}, [dispatch]);

	const handleAddFriend = async (friendId: string) => {
		try {
			const response = await sendFriendRequestApi(friendId);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<section className={styles.container}>
			<div className={styles.headerTitle}>
				<h2>Мои друзья ({realFriends.length})</h2>
			</div>

			<div className={styles.headerFriends}>
				<Input
					className={styles.search}
					placeholder='Введите имя друга...'
					iconLeft={<Search />}
					value={searchValue}
					onChange={handleSearchChange}
					inputPadding='5px 10px'
				/>
				<Button
					variant='tertiary'
					iconRight={
						<User
							onClick={() => navigate('/friends/find')}
							style={{ cursor: 'pointer' }}
						/>
					}
				/>
				<Button
					variant='tertiary'
					iconRight={
						<Dumbels
							onClick={() => navigate('/leader-board')}
							style={{ cursor: 'pointer' }}
						/>
					}
				/>
			</div>

			{isLoading && <div className={styles.loading}>Загрузка друзей...</div>}
			{error && <div className={styles.error}>Ошибка: {error}</div>}

			{!isLoading && !error && allFriends.length > 0 ? (
				<div className={styles.friendsContainer}>
					<div className={styles.friendsGrid}>
						{allFriends.map((friend: Friend) => (
							<FriendCard
								key={friend.id}
								friend={friend}
								variant='standard'
								onCardClick={handleCardClick}
								onRemove={handleRemove}
								onAddFriend={handleAddFriend}
								showRemoveButton={true}
								showAddButton={!friend.isFriend}
							/>
						))}
					</div>
				</div>
			) : (
				!isLoading && (
					<div className={styles.emptyState}>
						<p>У вас пока нет друзей</p>
					</div>
				)
			)}
		</section>
	);
};