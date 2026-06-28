import React from 'react';
import { Button } from '@ui';

import styles from './RouteSessionPanel.module.scss';

interface Props {
	current: number;
	total: number;
	progress: number;

	isStarted: boolean;
	isFinished: boolean;
	isAborted: boolean;

	onStart: () => void;
	onFinish: () => void;
	onAbort: () => void;
	onBack: () => void;
}

export const RouteSessionPanel = ({
	current,
	total,
	progress,
	isStarted,
	isFinished,
	isAborted,
	onStart,
	onFinish,
	onAbort,
	onBack,
}: Props) => {
	const isCompleted = current >= total;

	return (
		<div className={styles.panel}>
			<div className={styles.progress}>
				{current} / {total} точек ({progress}%)
			</div>

			<div className={styles.buttons}>
				{!isStarted && (
					<>
						<Button
							variant='primary'
							onClick={onStart}
							className={styles.buttonsControls}>
							Начать маршрут
						</Button>
					</>
				)}

				{isStarted &&
					!isFinished &&
					!isAborted &&
					(isCompleted ? (
						<Button
							variant='secondary'
							onClick={onFinish}
							className={styles.buttonsControls}>
							Завершить маршрут
						</Button>
					) : (
						<Button
							variant='secondary'
							onClick={onAbort}
							className={styles.buttonsControls}>
							Прервать маршрут
						</Button>
					))}

				{isFinished && (
					<>
						<Button disabled className={styles.buttonsControls}>
							Маршрут завершён
						</Button>
					</>
				)}

				{isAborted && (
					<>
						<Button disabled className={styles.buttonsControls}>
							Маршрут прерван
						</Button>
					</>
				)}
			</div>
		</div>
	);
};