import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Input } from '@ui';
import { useTheme } from '../../../hooks/useTheme';

import { ReactComponent as Search } from '../../../assets/icons/search.svg';
import { ReactComponent as Cross } from '../../../assets/icons/cross.svg';
import { ReactComponent as Compass } from '../../../assets/images/compass.svg';
import { ReactComponent as Moon } from '../../../assets/icons/moon.svg';
import { ReactComponent as Sun } from '../../../assets/icons/sun.svg';

import { MOCK_USER, MOCK_USER_AVATAR } from '../../../mocks/users';

import styles from './Header.module.scss';

export const Header = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { isLight, toggleTheme } = useTheme();

	const [isAuthenticated] = useState(MOCK_USER.isAuthenticated);

	const isAuthPage =
		location.pathname === '/login' ||
		location.pathname === '/registration' ||
		location.pathname === '/recovery-page';

	if (isAuthPage) {
		return (
			<header className={styles.header}>
				<nav className={styles.navigation_auth}>
					<Link to='/routie' className={styles.logoContainer}>
						<Compass
							className={
								isLight ? styles.logoLight : styles.logoDark
							}
						/>
						<span className={styles.logoTitle}>Routie</span>
					</Link>
					<Button
						type={'button'}
						variant={'tertiary'}
						iconRight={<Cross />}
						onClick={() => navigate('/routie', { replace: true })}
						children={'Закрыть'}
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
					<Compass
						className={isLight ? styles.logoLight : styles.logoDark}
					/>
					<span className={styles.logoTitle}>Routie</span>
				</Link>
				<Input
					placeholder={'Введите название маршрута...'}
					iconLeft={<Search />}
					inputPadding='7px 16px'
				/>
				<div className={styles.themeButton} onClick={toggleTheme}>
					{isLight ? <Moon /> : <Sun />}
				</div>
				{isAuthenticated ? (
					<Button
						type={'button'}
						variant={'tertiary'}
						iconRight={
							<Avatar
								size={'small'}
							/>
						}
						children={MOCK_USER.name}
						onClick={() => navigate('/profile')}
						className={styles.userCard}
					/>
				) : (
					<div className={styles.authContainer}>
						<Button
							type={'button'}
							variant={'secondary'}
							className={styles.auth}
							onClick={() => navigate('/login')}
							children={'Войти'}
						/>
						<Button
							type={'button'}
							variant={'primary'}
							className={styles.registration}
							onClick={() => navigate('/registration')}
							children={'Зарегистрироваться'}
						/>
					</div>
				)}
			</nav>
		</header>
	);
};
