import React from 'react';
import clsx from 'clsx';

import styles from './Blur.module.scss';

interface BlurProps {
	children?: React.ReactNode;
	className?: string;
	onClick?: () => void;
}

export const Blur: React.FC<BlurProps> = ({ children, className = '', onClick}) => {
	return (
		<div className={styles.whiteBox}>
			<div className={clsx(`${styles.blurContainer} ${className}`)}>
				{children}
			</div>
		</div>
	);
};
