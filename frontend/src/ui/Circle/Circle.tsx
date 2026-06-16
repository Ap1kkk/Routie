import React from 'react';
import styles from '../../ui/Circle/Circle.module.scss';

type CircleSize = 'small' | 'medium' | 'large';

interface CircleProps {
	level?: number;
	inCircle?: React.ReactNode;
	label?: string;
	size?: CircleSize;
}

export const Circle: React.FC<CircleProps> = ({
	level,
	inCircle,
	label,
	size = 'large',
}) => {
	const displayContent = inCircle !== undefined ? inCircle : level;

	const getLevelColorClass = (level?: number) => {
		if (!level) return '';
		if (level <= 50) return styles.levelGreen;
		if (level <= 100) return styles.levelBlue;
		return styles.levelOrange;
	}

	return (
		<div className={styles.circleContainer}>
			<span className={`${styles.circle} ${styles[size]} ${getLevelColorClass(level)}`}>
				{displayContent}
			</span>
			{label && <span className={styles.circleLabel}>{label}</span>}
		</div>
	);
};

export default Circle;
