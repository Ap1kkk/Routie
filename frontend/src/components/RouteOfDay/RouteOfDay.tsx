import React from 'react';
import styles from './RouteOfDay.module.scss';
import { Button } from '@ui';
import { Route } from '../../types/route';

interface RouteOfTheDayProps {
	route: Route;
	onNavigate: () => void;
}

export const RouteOfTheDay: React.FC<RouteOfTheDayProps> = ({
	route,
	onNavigate,
}) => {
	return (
		<div className={styles.background}>
			<div className={styles.overlay}>
				<h2 className={styles.title}>Маршрут дня: {route.name}</h2>
				<p className={styles.distance}>Дистанция: {route.distance} м</p>
				<Button
					variant='primary'
					onClick={onNavigate}
					className={styles.button}>
					Поехали
				</Button>
			</div>
		</div>
	);
};
