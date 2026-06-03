import React from 'react';
import styles from './RouteOfDay.module.scss';
import { Blur, Button } from '@ui';
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
		<Blur className={styles.container}>
			<h2 className={styles.title}>
				Маршрут дня: <br />
				{route.name}
			</h2>
			<Button
				variant='primary'
				onClick={onNavigate}
				className={styles.button}>
				Поехали
			</Button>
		</Blur>
	);
};
