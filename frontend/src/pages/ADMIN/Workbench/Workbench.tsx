import React from 'react';
import { Link } from 'react-router-dom';

import {ReactComponent as Audio } from '../../../assets/icons/admin/audio.svg';
import {ReactComponent as Tag } from '../../../assets/icons/admin/tag.svg';
import {ReactComponent as Landmark } from '../../../assets/icons/admin/landmark.svg';
import {ReactComponent as Route } from '../../../assets/icons/admin/route.svg';

import styles from './Workbench.module.scss';

const adminCards = [
	{
		to: '/admin/landmarks-edit',
		icon: <Landmark />,
		title: 'Изменение достопримечательностей',
	},
	{
		to: '/admin/routes-edit',
		icon: <Route />,
		title: 'Изменение маршрута',
	},
	{
		to: '/admin/tags-edit',
		icon: <Tag />,
		title: 'Изменение тегов',
	},
	{
		to: '/admin/audioguides-edit',
		icon: <Audio />,
		title: 'Изменение аудиогидов',
	},
];

export const Workbench = () => {
	return (
		<section className={styles.section}>
			<h2 className={styles.title}>Панель администратора</h2>

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
