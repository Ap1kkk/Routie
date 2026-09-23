import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';
import { Avatar } from '@ui';

import { ReactComponent as Home } from '../../../assets/icons/home.svg';
import { ReactComponent as Search } from '../../../assets/icons/search.svg';
import { ReactComponent as Like } from '../../../assets/icons/like.svg';

import styles from './MobileFooter.module.scss';
import { getMyProfile } from '../../../services/slices/profileSlice/profileSlice';
import { downloadFile } from '../../../services/slices/fileSlice/fileSlice';

export const MobileFooter = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { myProfile } = useSelector((state) => state.profile);
	const { isAuthenticated } = useSelector((state) => state.auth);

	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const indicatorRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

	const paths = ['/routie', '/routes', '/favorites', '/settings'];

	const hideOnPaths = [
		'/login',
		'/registration',
		'/recovery-page',
		'/privacy',
		'/terms',
	];

	const isMapRoute = location.pathname.startsWith('/map/');

	const shouldHideFooter = hideOnPaths.includes(location.pathname) || isMapRoute;

	useEffect(() => {
		if (isAuthenticated && !myProfile) {
			dispatch(getMyProfile());
		}
	}, [dispatch, isAuthenticated, myProfile]);

	useEffect(() => {
		if (myProfile?.avatar?.id) {
			dispatch(downloadFile(myProfile.avatar.id))
				.unwrap()
				.then((url) => setAvatarUrl(url))
				.catch(() => setAvatarUrl(null));
		} else {
			setAvatarUrl(null);
		}
	}, [myProfile, dispatch]);

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

	if (shouldHideFooter) {
		return null;
	}

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
					onClick={() => navigate('/favorites-mobile')}
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
					<Avatar
						src={avatarUrl || undefined}
						alt='avatar'
						size='tiny'
					/>
					<span className={styles.title}>Профиль</span>
				</button>
			</nav>
		</footer>
	);
};