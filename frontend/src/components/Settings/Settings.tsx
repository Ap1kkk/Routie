import React from 'react';
import styles from './Settings.module.scss';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from '@ui';
import { useTheme } from '../../hooks/useTheme';

import { ReactComponent as User } from '../../assets/icons/user-circle.svg';
import { ReactComponent as Edit } from '../../assets/icons/edit.svg';
import { ReactComponent as Achievements } from '../../assets/icons/achievements.svg';
import { ReactComponent as Stats } from '../../assets/icons/stats.svg';
import { ReactComponent as Sun } from '../../assets/icons/sun.svg';
import { ReactComponent as Moon } from '../../assets/icons/moon.svg';
import { ReactComponent as ArrowRight } from '../../assets/icons/chevron-right.svg';

interface SettingsProps {
	onLogout?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
	const navigate = useNavigate();
	const { isLight, toggleTheme } = useTheme();

	const handleLogout = () => {
		if (onLogout) {
			onLogout();
		}
	};

	return (
		<div className={styles.container}>
			<article className={styles.headerContent}>
				<Avatar size={'big'} />
				<p className={styles.profileUsername}>
					Eвгений
					<span className={styles.level}>100</span>
				</p>
				<p className={styles.profileEmail}>evgeniinaumov04@gmail.com</p>
			</article>
			<div className={styles.sectionCards}>
				<article className={styles.card}>
					<div className={styles.buttonCard}>
						<User />
						<Button
							children={'Профиль'}
							iconRight={<ArrowRight />}
							variant={'tertiary'}
							className={styles.buttonMenu}
							onClick={() => navigate('/profile')}
						/>
					</div>
					<span className={styles.separator}></span>
					<div className={styles.buttonCard}>
						<Edit />
						<Button
							children={'Редактирование профиля'}
							iconRight={<ArrowRight />}
							variant={'tertiary'}
							className={styles.buttonMenu}
							onClick={() => navigate('/profile/edit')}
						/>
					</div>
				</article>
				<article className={styles.card}>
					<div className={styles.buttonCard}>
						<Stats />
						<Button
							children={'Статистика'}
							iconRight={<ArrowRight />}
							variant={'tertiary'}
							className={styles.buttonMenu}
							onClick={() => navigate('/statistic')}
						/>
					</div>
					<span className={styles.separator}></span>
					<div className={styles.buttonCard}>
						<Achievements />
						<Button
							children={'Достижения'}
							iconRight={<ArrowRight />}
							variant={'tertiary'}
							className={styles.buttonMenu}
							onClick={() => navigate('/achievement')}
						/>
					</div>
				</article>
				<article className={styles.card}>
					<Button
						onClick={toggleTheme}
						variant={'tertiary'}
						iconLeft={isLight ? <Moon /> : <Sun />}
						children={isLight ? 'Тёмная тема' : 'Светлая тема'}
						className={styles.buttons}
					/>
				</article>

				<article className={styles.card}>
					<Button
						onClick={handleLogout}
						variant={'tertiary'}
						className={`${styles.buttons} ${styles.exit}`}
						children='Выйти из аккаунта'
					/>
				</article>
			</div>
		</div>
	);
};
