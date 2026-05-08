import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from '@ui';

import { ReactComponent as Home } from '../../../assets/icons/home.svg';
import { ReactComponent as Search } from '../../../assets/icons/search.svg';
import { ReactComponent as Like } from '../../../assets/icons/like.svg';

import styles from './MobileFooter.module.scss';

export const MobileFooter = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const indicatorRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

	const paths = ['/routie', '/routes', '/favourites', '/settings'];

	const updateIndicator = () => {
		const activeIndex = paths.findIndex(
			(path) => location.pathname === path
		);
		if (activeIndex === -1 || !indicatorRef.current) return;

		const activeButton = buttonsRef.current[activeIndex];
		if (!activeButton) return;

		const buttonRect = activeButton.getBoundingClientRect();
		const navRect = activeButton.parentElement?.getBoundingClientRect();

		if (navRect) {
			const left = buttonRect.left - navRect.left;
			const width = buttonRect.width;

			indicatorRef.current.style.transform = `translateX(${left}px)`;
			indicatorRef.current.style.width = `${width}px`;
		}
	};

	useEffect(() => {
		updateIndicator();
		window.addEventListener('resize', updateIndicator);
		return () => window.removeEventListener('resize', updateIndicator);
	}, [location.pathname]);

	useEffect(() => {
		updateIndicator();
	}, []);

	return (
		<footer className={styles.footer}>
			<nav className={styles.navigation}>
				<div ref={indicatorRef} className={styles.indicator} />
				<button
					ref={(el) => {
						buttonsRef.current[0] = el;
					}}
					onClick={() => navigate('/routie')}
					className={styles.button}>
					<Home />
					<span className={styles.title}>Главная</span>
				</button>

				<button
					ref={(el) => {
						buttonsRef.current[1] = el;
					}}
					onClick={() => navigate('/routes')}
					className={styles.button}>
					<Search />
					<span className={styles.title}>Поиск</span>
				</button>

				<button
					ref={(el) => {
						buttonsRef.current[2] = el;
					}}
					onClick={() => navigate('/favourites')}
					className={styles.button}>
					<Like />
					<span className={styles.title}>Избранное</span>
				</button>

				<button
					ref={(el) => {
						buttonsRef.current[3] = el;
					}}
					onClick={() => navigate('/settings')}
					className={styles.button}>
					<Avatar alt='avatar' size='tiny' />
					<span className={styles.title}>Профиль</span>
				</button>
			</nav>
		</footer>
	);
};
