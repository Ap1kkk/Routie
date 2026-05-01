import React from 'react';
import { AchievementCard } from '../AchievementCard';
import { AchievementItem } from '../../types/achievments';
import styles from './Achievement.module.scss';

interface AchievementProps {
	achievementsData?: AchievementItem[];
}

export const Achievement: React.FC<AchievementProps> = ({
	achievementsData = [],
}) => {
	return (
		<div className={styles.container}>
			<h2 className={styles.achievementTitle}>Достижения</h2>
			<div className={styles.achievementContent}>
				{achievementsData.map((achievement, index) => (
					<AchievementCard
						key={achievement.id}
						index={index}
						title={achievement.title}
						caption={achievement.caption}
						children={achievement.value}
					/>
				))}
			</div>
		</div>
	);
};
