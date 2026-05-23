import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as User } from '../../../assets/icons/user-large.svg';
import { ReactComponent as Marker } from '../../../assets/icons/marker.svg';
import { ReactComponent as Route } from '../../../assets/icons/route.svg';
import { ReactComponent as Achievements } from '../../../assets/icons/achievements-large.svg';

import styles from './Workbench.module.scss';

const adminCards = [
	{
		to: '/admin/routes/points',
		icon: <Marker />,
		title: 'Изменение точек маршрута',
	},
	{
		to: '/admin/routes/edit',
		icon: <Route />,
		title: 'Изменение маршрута',
	},
	{
		to: '/admin/users',
		icon: <User />,
		title: 'Пользователи',
	},
	{
		to: '/admin/achievements',
		icon: <Achievements />,
		title: 'Достижения',
	},
	{
		to: '/admin/tags',
		icon: <Achievements />,
		title: 'Тэги',
	},
];

export const Workbench = () => {
	return (
		<section className={styles.section}>
			<h1 className={styles.title}>Панель администратора</h1>

			<div className={styles.cardList}>
				{adminCards.map((card, index) => (
					<Link key={index} to={card.to} className={styles.editCard}>
						<div className={styles.iconWrapper}>{card.icon}</div>
						<span className={styles.cardTitle}>{card.title}</span>
					</Link>
				))}
			</div>
		</section>
	);
};
