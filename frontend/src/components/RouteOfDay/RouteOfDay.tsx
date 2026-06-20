import React from 'react';
import styles from './RouteOfDay.module.scss';
import { Blur, Button } from '@ui';
import { Route } from '../../types/Route';

interface RouteOfTheDayProps {
	route: Route;
	onNavigate: () => void;
}

export const RouteOfTheDay: React.FC<RouteOfTheDayProps> = ({
	route,
	onNavigate,
}) => {
	return (
		<Blur className={styles.container}>
			<h2 className={styles.title}>
				Маршрут дня: <br />
			</h2>
			<p className={styles.routeTitle}>
				{route.title}
			</p>
			<p className={styles.routeText}>
				Дальность: {route.lengthMeters} м.
			</p>
			<Button
				variant='primary'
				onClick={onNavigate}
				className={styles.button}>
				Поехали
			</Button>
		</Blur>
	);
};
