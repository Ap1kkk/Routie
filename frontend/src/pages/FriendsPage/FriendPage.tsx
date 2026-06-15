import React, { useState } from 'react';
import { FriendCard } from '@components';
import { Friend } from '../../types/Friends';
import styles from './FriendPage.module.scss';
import { Button, Input } from '@ui';

import { ReactComponent as Search } from '../../assets/icons/search.svg';
import { ReactComponent as Dumbels } from '../../assets/icons/dumbells.svg';

// Моковые данные
const mockFriends: Friend[] = [
	{
		id: '1',
		name: 'Андрей Смирнов',
		currentLevel: 34,
		totalXp: 12450,
		isFriend: true,
	},
	{
		id: '2',
		name: 'Екатерина Морозова',
		currentLevel: 28,
		totalXp: 8750,
		isFriend: true,
	},
	{
		id: '3',
		name: 'Максим Петров',
		currentLevel: 41,
		totalXp: 18900,
		isFriend: true,
	},
	{
		id: '4',
		name: 'Анна Ковалёва',
		currentLevel: 19,
		totalXp: 3200,
		isFriend: true,
	},
	{
		id: '5',
		name: 'Дмитрий Соколов',
		currentLevel: 25,
		totalXp: 6700,
		isFriend: true,
	},
	{
		id: '6',
		name: 'Ольга Васильева',
		currentLevel: 32,
		totalXp: 11200,
		isFriend: true,
	},
];

export const FriendsPage: React.FC = () => {
	const [friends] = useState<Friend[]>(mockFriends);

	const handleCardClick = (friendId: string) => {
		console.log('Переход в профиль друга:', friendId);
		// navigate(`/profile/${friendId}`);
	};

	const handleRemove = (friendId: string) => {
		console.log('Удаление друга:', friendId);
		// Здесь будет логика удаления
	};

	return (
		<section className={styles.container}>
			<div className={styles.headerTitle}>
				<h2>Мои друзья</h2>
			</div>
			<div className={styles.headerFriends}>
				<Input
					className={styles.search}
					placeholder={'Введите имя друга...'}
					iconLeft={<Search />}
					inputPadding='5px 10px'
				/>
				<Button
					variant='tertiary'
					iconRight={<Dumbels />}
				/>
			</div>

			{friends.length > 0 ? (
				<div className={styles.friendsContainer}>
					<div className={styles.friendsGrid}>
						{friends.map((friend) => (
							<FriendCard
								key={friend.id}
								friend={friend}
								variant='standard'
								onCardClick={handleCardClick}
								onRemove={handleRemove}
							/>
						))}
					</div>
				</div>
			) : (
				<div className={styles.emptyState}>
					<p>У вас пока нет друзей</p>
				</div>
			)}
		</section>
	);
};
