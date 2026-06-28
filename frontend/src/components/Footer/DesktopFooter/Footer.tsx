import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import { ReactComponent as Compass } from '../../../assets/images/compass.svg';

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	const [theme] = useState<boolean>(() => {
		const saved = localStorage.getItem('theme');
		return saved === 'light';
	});

	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<Link to='/routie' className={styles.logoContainer}>
					<Compass
						className={theme ? styles.logoLight : styles.logoDark}
					/>
					<span className={styles.logoTitle}>Routie</span>
				</Link>
				<div className={styles.links}>
					<Link to='/about' className={styles.link}>
						О нас
					</Link>
					<Link to='/contacts' className={styles.link}>
						Контакты
					</Link>
					<Link to='/terms' className={styles.link}>
						Политика конфиденциальности
					</Link>
				</div>
			</div>

			<div className={styles.containerInfo}>
				<p className={styles.copyright}>
					© {currentYear} Routie. Все права защищены
				</p>
				<span>Версия 1.0.0</span>
			</div>
		</footer>
	);
};
