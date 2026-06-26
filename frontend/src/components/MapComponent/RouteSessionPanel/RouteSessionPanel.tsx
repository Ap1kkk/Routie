import React from 'react';
import { Button } from '@ui';

import styles from './RouteSessionPanel.module.scss';

interface Props {
	current: number;
	total: number;
	progress: number;

	isStarted: boolean;
	isFinished: boolean;

	onStart: () => void;
	onFinish: () => void;
}

export const RouteSessionPanel = ({
	current,
	total,
	progress,
	isStarted,
	isFinished,
	onStart,
	onFinish,
}: Props) => {
	return (
		<div className={styles.panel}>
			<div className={styles.progress}>
				{current} / {total} точек ({progress}%)
			</div>

			<div className={styles.buttons}>
				{!isStarted && (
					<Button variant='primary' onClick={onStart}>
						Начать маршрут
					</Button>
				)}

				{isStarted && !isFinished && (
					<Button variant='secondary' onClick={onFinish}>
						Завершить маршрут
					</Button>
				)}

				{isFinished && <Button disabled>Маршрут завершён</Button>}
			</div>
		</div>
	);
};
