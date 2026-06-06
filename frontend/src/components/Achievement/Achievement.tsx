import React from 'react';
import { AchievementCard } from '../AchievementCard';
import styles from './Achievement.module.scss';
import { UserAchievement } from '../../types/Gamification';


interface AchievementProps {
	achievementsData?: UserAchievement[];
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
						key={achievement.achievementId}
						index={index}
						title={achievement.title}
						caption={achievement.description}
						value={achievement.progress}
						finishValue={achievement.targetValue}
					/>
				))}
			</div>
		</div>
	);
};
