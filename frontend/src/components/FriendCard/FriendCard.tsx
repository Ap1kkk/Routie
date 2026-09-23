import React from 'react';
import { Avatar, Blur, Circle } from '@ui';
import styles from './FriendCard.module.scss';
import { ReactComponent as Cross } from '../../assets/icons/cross.svg';
import { ReactComponent as Add } from '../../assets/icons/add.svg';
import { Friend } from '../../types/Friends';

interface FriendCardProps {
	friend: Friend;
	avatarSrc?: string; // ← новое

	variant?: 'standard' | 'compact';
	rank?: number;
	showRank?: boolean;
	showMedal?: boolean;

	showRemoveButton?: boolean;
	showAddButton?: boolean;
	showUsername?: boolean;

	onCardClick?: (friendId: string) => void;
	onRemove?: (friendId: string) => void;
	onAddFriend?: (friendId: string) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
	friend,
	avatarSrc,
	variant = 'standard',
	rank,
	showRank = false,
	showMedal = false,
	showRemoveButton = true,
	showAddButton = false,
	showUsername = true,
	onCardClick,
	onRemove,
	onAddFriend,
}) => {
	const handleCardClick = () => {
		onCardClick?.(friend.id);
	};

	const handleRemoveClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onRemove?.(friend.id);
	};

	const handleAddClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onAddFriend?.(friend.id);
	};

	const getMedalClass = () => {
		if (!showMedal || !rank) return '';
		if (rank === 1) return styles.gold;
		if (rank === 2) return styles.silver;
		if (rank === 3) return styles.bronze;
		return '';
	};

	if (variant === 'compact') {
		return (
			<article
				className={styles.compactCard}
				onClick={handleCardClick}
				style={{ cursor: onCardClick ? 'pointer' : 'default' }}>
				<div className={styles.compactContent}>
					<Avatar size='small' src={avatarSrc} />
					<span className={styles.compactCardTitle}>
						{friend.name}
					</span>
				</div>

				<div className={styles.compactCardButtons}>
					<Circle level={friend.currentLevel} size='medium' />
					{showAddButton && (
						<Add
							onClick={handleAddClick}
							style={{ cursor: 'pointer' }}
						/>
					)}
					{showRemoveButton && (
						<Cross
							onClick={handleRemoveClick}
							style={{ cursor: 'pointer' }}
						/>
					)}
				</div>
			</article>
		);
	}

	return (
		<Blur
			className={`${styles.standardCard} ${getMedalClass()}`}
			onClick={handleCardClick}>
			<div className={styles.standardContent}>
				{showRank && rank !== undefined && (
					<div className={styles.rank}>#{rank}</div>
				)}
				<Avatar size='medium' src={avatarSrc} />
				<div>
					<span className={styles.standardCardTitle}>
						{friend.name}
					</span>
					{showUsername && friend.username && (
						<span className={styles.standardCardUsername}>
							@{friend.username}
						</span>
					)}
				</div>
			</div>

			<div className={styles.standardCardButtons}>
				<Circle level={friend.currentLevel} size='large' />
				{showAddButton && (
					<Add
						onClick={handleAddClick}
						style={{ cursor: 'pointer' }}
					/>
				)}
				{showRemoveButton && (
					<Cross
						onClick={handleRemoveClick}
						style={{ cursor: 'pointer' }}
					/>
				)}
			</div>
		</Blur>
	);
};
