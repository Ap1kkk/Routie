import React from 'react';
import styles from './ProgressBar.module.scss'

interface ProgressBarProps {
	value: number;
	max?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100}) => {
	const percent = Math.min((value / max) * 100, 100);

	return (
		<div className={styles.progressBar}>
			<div
				className={styles.progressFill}
				style={{ width: `${percent}%` }}
			/>

			<span className={styles.progressText}>{percent}%</span>
		</div>
	);
}