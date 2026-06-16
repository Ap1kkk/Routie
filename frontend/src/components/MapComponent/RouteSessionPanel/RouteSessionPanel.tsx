import React from 'react';
import { Button } from '@ui';

import styles from './RouteSessionPanel.module.scss'

interface Props {
	current: number;
	total: number;
	progress: number;
}

export const RouteSessionPanel = ({ current, total, progress }: Props) => {
	return (
		<div className={styles.panel}>
			<div className={styles.progress}>
				{current} / {total} точек ({progress}%)
			</div>

			<div className={styles.buttons}>
				<Button>Начать</Button>
			</div>
		</div>
	);
};
