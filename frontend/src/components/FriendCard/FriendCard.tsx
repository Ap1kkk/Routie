import React from 'react';
import { Avatar, Blur } from '@ui';
import styles from './FriendCard.module.scss'
import { ReactComponent as Cross } from '../../assets/icons/cross.svg';
import { Friend } from '../../types/Friends';

interface FriendCardProps {
	friend: Friend;

	variant?: 'standard' | 'compact';
	rank?: number;
	showRank?: boolean;
	showMedal?: boolean;
	onCardClick?: (friendId: string) => void;

	onRemove?: (friendId: string) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
	friend,
	variant = 'standard',
	rank,
	showRank = false,
	showMedal = false,
	onCardClick,
	onRemove,
}) => {
	const getMedalClass = () => {
		if (!rank || !showMedal) return '';
		if (rank === 1) return styles.gold;
		if (rank === 2) return styles.silver;
		if (rank === 3) return styles.bronze;
		return ''
	}

	if (variant === 'compact') {
		return (
			<article className={styles.compactCard}>
				<div className={styles.compactContent}>
					<Avatar size={'small'} />
					<span className={styles.compactCardTitle}>
						{friend.name}
					</span>
				</div>

				<div className={styles.compactCardButtons}>
					<span className={styles.compactCardLevel}>
						{friend.currentLevel}
					</span>
					<Cross />
				</div>
			</article>
		);
	}

	if (variant === 'standard') {
		return (
			<Blur className={`${styles.standardCard} ${getMedalClass()}`}>
				<div className={styles.standardContent}>
					{showRank && rank !== undefined && (
						<div className={styles.rank}>{rank}</div>
					)}
					<Avatar size={'medium'} />
					<span className={styles.standardCardTitle}>
						{friend.name}
					</span>
				</div>

				<div className={styles.standardCardButtons}>
					<span className={styles.standardCardLevel}>
						{friend.currentLevel}
					</span>
					<Cross />
				</div>
			</Blur>
		);
	}
};
