import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '@store';

import { Avatar, Button, Input } from '@ui';
import { useTheme } from '../../../hooks/useTheme';

import { ReactComponent as Search } from '../../../assets/icons/search.svg';
import { ReactComponent as Cross } from '../../../assets/icons/cross.svg';
import { ReactComponent as Compass } from '../../../assets/images/compass.svg';
import { ReactComponent as Moon } from '../../../assets/icons/moon.svg';
import { ReactComponent as Sun } from '../../../assets/icons/sun.svg';
import { ReactComponent as Heart } from '../../../assets/icons/like.svg';
import { ReactComponent as Not } from '../../../assets/icons/notification.svg';

import styles from './Header.module.scss';
import { getMyProfile } from '../../../services/slices/profileSlice/profileSlice';
import { downloadFile } from '../../../services/slices/fileSlice/fileSlice';

export const Header = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isLight, toggleTheme } = useTheme();

	const { myProfile } = useSelector((state) => state.profile);
	const { isAuthenticated, initialized } = useSelector((state) => state.user);

	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const isAuthPage =
		location.pathname === '/login' ||
		location.pathname === '/registration' ||
		location.pathname === '/recovery-page';

	useEffect(() => {
		if (isAuthenticated && initialized && !myProfile) {
			dispatch(getMyProfile());
		}
	}, [dispatch, isAuthenticated, initialized, myProfile]);

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

	if (isAuthPage) {
		return (
			<header className={styles.header}>
				<nav className={styles.navigation_auth}>
					<Link to='/routie' className={styles.logoContainer}>
						<Compass className={isLight ? styles.logoLight : styles.logoDark} />
						<span className={styles.logoTitle}>Routie</span>
					</Link>
					<Button
						type="button"
						variant="tertiary"
						iconRight={<Cross />}
						onClick={() => navigate('/routie', { replace: true })}
						children="Закрыть"
						className={styles.closeButton}
					/>
				</nav>
			</header>
		);
	}

	return (
		<header className={styles.header}>
			<nav className={styles.navigation}>
				<Link to='/routie' className={styles.logoContainer}>
					<Compass className={isLight ? styles.logoLight : styles.logoDark} />
					<span className={styles.logoTitle}>Routie</span>
				</Link>

				<Input
					placeholder="Введите название маршрута..."
					iconLeft={<Search />}
					inputPadding="7px 16px"
				/>

				<div className={styles.themeButton} onClick={toggleTheme}>
					{isLight ? <Moon /> : <Sun />}
				</div>

				<div
					className={styles.themeButton}
					onClick={() => navigate('/favorites')}
					title="Избранное"
				>
					<Heart />
				</div>

				<div className={styles.themeButton}>
					<Not />
				</div>

				{isAuthenticated && myProfile ? (
					<Button
						type="button"
						variant="tertiary"
						iconRight={
							<Avatar
								src={avatarUrl || undefined}
								size="small"
							/>
						}
						children={myProfile.name}
						onClick={() => navigate('/profile')}
						className={styles.userCard}
					/>
				) : (
					<div className={styles.authContainer}>
						<Button
							type="button"
							variant="secondary"
							className={styles.auth}
							onClick={() => navigate('/login')}
							children="Войти"
						/>
						<Button
							type="button"
							variant="primary"
							className={styles.registration}
							onClick={() => navigate('/registration')}
							children="Зарегистрироваться"
						/>
					</div>
				)}
			</nav>
		</header>
	);
};