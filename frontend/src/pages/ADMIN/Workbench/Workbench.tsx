import React from 'react';
import { Link } from 'react-router-dom';

import {
	ReactComponent as User,
	ReactComponent as Marker,
	ReactComponent as Route,
} from '../../../assets/icons/placeholder.svg';

import styles from './Workbench.module.scss';

const adminCards = [
	{
		to: '/admin/landmarks-edit',
		icon: <Marker />,
		title: 'Изменение достопримечательностей',
	},
	{
		to: '/admin/routes-edit',
		icon: <Route />,
		title: 'Изменение маршрута',
	},
	{
		to: '/admin/tags-edit',
		icon: <User />,
		title: 'Изменение тегов',
	},
	{
		to: '/admin/audioguides-edit',
		icon: <User />,
		title: 'Изменение аудиогидов',
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
