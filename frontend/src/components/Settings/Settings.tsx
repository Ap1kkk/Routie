import React, { useEffect, useState } from 'react';
import styles from './Settings.module.scss';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Circle } from '@ui';
import { useTheme } from '../../hooks/useTheme';
import { getUserRolesApi } from '../../utils/api/AuthApi';

import { ReactComponent as User } from '../../assets/icons/user-circle.svg';
import { ReactComponent as Edit } from '../../assets/icons/edit.svg';
import { ReactComponent as Achievements } from '../../assets/icons/achievements.svg';
import { ReactComponent as Stats } from '../../assets/icons/stats.svg';
import { ReactComponent as Sun } from '../../assets/icons/sun.svg';
import { ReactComponent as Moon } from '../../assets/icons/moon.svg';
import { ReactComponent as ArrowRight } from '../../assets/icons/chevron-right.svg';
import { ReactComponent as Monitor } from '../../assets/icons/book.svg';

interface ActiveSession {
	id: string;
	deviceId: string;
	deviceName: string;
	createdAt: string;
	lastUsedAt: string;
	expiresAt: string;
}

interface SettingsProps {
	username?: string;
	name?: string;
	level?: number;
	avatar?: string;
	activeSessions?: ActiveSession[];
	onLogout?: () => void;
	onTerminateSession?: (sessionId: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
	username,
	name,
	level,
	avatar,
	activeSessions = [],
	onLogout,
	onTerminateSession,
}) => {
	const navigate = useNavigate();
	const { isLight, toggleTheme } = useTheme();
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const loadRoles = async () => {
			try {
				const result = await getUserRolesApi();

				if (result.success && result.data) {
					setIsAdmin(result.data.roles.includes('ADMIN'));
				}
			} catch (e) {
				console.error(e);
			}
		};

		loadRoles();
	}, []);

	return (
		<div className={styles.container}>
			<article className={styles.headerContent}>
				<Avatar src={avatar} size='big' />
				<p className={styles.profileUsername}>
					{name}
					<Circle level={level} size='small' />
				</p>
				<p className={styles.profileEmail}>@{username}</p>
			</article>

			<div className={styles.sectionCards}>
				<article className={styles.card}>
					<div className={styles.buttonCard}>
						<User />
						<Button
							children='Профиль'
							iconRight={<ArrowRight />}
							variant='tertiary'
							className={styles.buttonMenu}
							onClick={() => navigate('/profile')}
						/>
					</div>
					<span className={styles.separator}></span>
					<div className={styles.buttonCard}>
						<Edit />
						<Button
							children='Редактирование профиля'
							iconRight={<ArrowRight />}
							variant='tertiary'
							className={styles.buttonMenu}
							onClick={() => navigate('/profile/edit')}
						/>
					</div>
				</article>

				<article className={styles.card}>
					<div className={styles.buttonCard}>
						<Stats />
						<Button
							children='Статистика'
							iconRight={<ArrowRight />}
							variant='tertiary'
							className={styles.buttonMenu}
							onClick={() => navigate('/statistic')}
						/>
					</div>
					<span className={styles.separator}></span>
					<div className={styles.buttonCard}>
						<Achievements />
						<Button
							children='Достижения'
							iconRight={<ArrowRight />}
							variant='tertiary'
							className={styles.buttonMenu}
							onClick={() => navigate('/achievements')}
						/>
					</div>
				</article>

				<article className={styles.card}>
					<Button
						onClick={toggleTheme}
						variant='tertiary'
						iconLeft={isLight ? <Moon /> : <Sun />}
						children={isLight ? 'Тёмная тема' : 'Светлая тема'}
						className={styles.buttons}
					/>
				</article>

				<article className={styles.card}>
					<div className={styles.buttonCard}>
						<Monitor />
						<Button
							children={`Активные сессии (${activeSessions.length})`}
							iconRight={<ArrowRight />}
							variant='tertiary'
							className={styles.buttonMenu}
							onClick={() => navigate('/settings/sessions')}
						/>
					</div>
				</article>

				{isAdmin && (
					<article className={styles.card}>
						<Button
							onClick={() => navigate('/admin')}
							variant='tertiary'
							className={`${styles.buttons} ${styles.exit}`}>
							Панель администратора
						</Button>
					</article>
				)}

				<article className={styles.card}>
					<Button
						onClick={onLogout}
						variant='tertiary'
						className={`${styles.buttons} ${styles.exit}`}
						children='Выйти из аккаунта'
					/>
				</article>
			</div>
		</div>
	);
};
