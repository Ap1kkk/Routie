import React from 'react';
import { Avatar, Blur, Circle } from '@ui';
import styles from './FriendCard.module.scss';
import { ReactComponent as Cross } from '../../assets/icons/cross.svg';
import { Friend } from '../../types/Friends';

interface FriendCardProps {
	friend: Friend;

	variant?: 'standard' | 'compact';

	rank?: number;
	showRank?: boolean;
	showMedal?: boolean;

	showRemoveButton?: boolean;

	onCardClick?: (friendId: string) => void;

	onRemove?: (friendId: string) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
	friend,
	variant = 'standard',
	rank,
	showRank = false,
	showMedal = false,
	showRemoveButton = true, // ← по умолчанию показываем
	onCardClick,
	onRemove,
}) => {
	const handleCardClick = () => {
		onCardClick?.(friend.id);
	};

	const handleRemoveClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onRemove?.(friend.id);
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
					<Avatar size='small' />
					<span className={styles.compactCardTitle}>
						{friend.name}
					</span>
				</div>

				<div className={styles.compactCardButtons}>
					<Circle level={friend.currentLevel} size='medium' />
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
			onClick={handleCardClick}
		>
			<div className={styles.standardContent}>
				{showRank && rank !== undefined && (
					<div className={styles.rank}>#{rank}</div>
				)}
				<Avatar size='medium' />
				<span className={styles.standardCardTitle}>{friend.name}</span>
			</div>

			<div className={styles.standardCardButtons}>
				<Circle level={friend.currentLevel} size='large' />
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
