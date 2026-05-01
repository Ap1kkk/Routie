import styles from './AchievementCard.module.scss';
import React, { useMemo } from 'react';

import { ReactComponent as Ach1 } from '../../assets/images/achievmensPicture/medal.svg';
import { ReactComponent as Ach2 } from '../../assets/images/achievmensPicture/camera.svg';
import { ReactComponent as Ach3 } from '../../assets/images/achievmensPicture/dumbells.svg';
import { ReactComponent as Ach4 } from '../../assets/images/achievmensPicture/earth.svg';
import { ReactComponent as Ach5 } from '../../assets/images/achievmensPicture/ghost.svg';
import { ReactComponent as Ach6 } from '../../assets/images/achievmensPicture/office.svg';

interface AchievementCardProps {
	children?: React.ReactNode;
	title?: string;
	caption?: string;
	index?: number;
}

const ACHIEVEMENT_ICONS = [Ach1, Ach2, Ach3, Ach4, Ach5, Ach6];

export const AchievementCard: React.FC<AchievementCardProps> = ({
	children,
	title = '',
	caption = '',
	index = 0,
}) => {
	const Icon = useMemo(() => {
		const iconIndex = index % ACHIEVEMENT_ICONS.length;
		console.log('Index:', index, 'IconIndex:', iconIndex); // Для проверки
		return ACHIEVEMENT_ICONS[iconIndex];
	}, [index]);

	return (
		<article className={styles.container}>
			<div className={styles.cardImage}>
				<Icon />
			</div>

			<span className={styles.cardTitle}>{title}</span>
			<p className={styles.cardCaption}>{caption}</p>
			<span className={styles.cardContent}>
				<span className={styles.cardContentValue}>{children}</span>
			</span>
		</article>
	);
};
