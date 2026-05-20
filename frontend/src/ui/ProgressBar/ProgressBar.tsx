import React from 'react';
import styles from './ProgressBar.module.scss'

interface ProgressBarProps {
	value: number;
	max?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100}) => {
	const percent = Math.min((value / max) * 100, 100);
	const roundedPercent = Math.round(percent);

	return (
		<div className={styles.progressBar}>
			<div
				className={styles.progressFill}
				style={{ width: `${roundedPercent}%` }}
			/>

			<span className={styles.progressText}>{roundedPercent}%</span>
		</div>
	);
}