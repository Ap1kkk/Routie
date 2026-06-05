import React, { useEffect, useRef, useState } from 'react';
import styles from '../../components/Profile/Profile.module.scss';
import { Avatar, Button } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../hooks/useDeviceType';
import { RouteCard } from '../RouteCard';
import { Route } from '../../types/Route';

interface Friend {
	id: string;
	name: string;
	avatar?: string;
	username?: string;
}

interface ProfileProps {
	username?: string;
	name?: string;
	email?: string;
	phone?: string;
	avatar?: string;

	city?: string;
	gender?: string;

	level?: number;
	totalXp?: number;

	routesCounter?: number;
	totalDistanceMeters?: number;
	totalLandmarksVisited?: number;

	birthday?: string;
	friends?: Friend[];
	recentRoutes?: Route[];
}

export const Profile: React.FC<ProfileProps> = ({
	username,
	name,
	email,
	phone,
	avatar,

	city,
	gender,

	level,
	totalXp,

	routesCounter,
	totalDistanceMeters,
	totalLandmarksVisited,

	birthday,
	friends = [],
	recentRoutes = [],
}) => {
	const navigate = useNavigate();
	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';
	const [showMenu, setShowMenu] = useState(false);
	const levelRef = useRef<HTMLSpanElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleLevelClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowMenu(!showMenu);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				showMenu &&
				levelRef.current &&
				!levelRef.current.contains(e.target as Node) &&
				menuRef.current &&
				!menuRef.current.contains(e.target as Node)
			) {
				setShowMenu(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showMenu]);

	const displayedFriends = friends.slice(0, 5);

	return (
		<div className={styles.container}>
			{isMobile ? (
				<div className={styles.containerMobile}>
					<div className={styles.headerMobile}>
						<Avatar src={avatar} size={'large'} />
						<h4 className={styles.profileName}>
							{name}
							<span
								ref={levelRef}
								className={styles.profileLevel}
								onClick={handleLevelClick}>
								{level}
								{showMenu && (
									<div
										className={styles.levelMenu}
										ref={menuRef}
										onClick={(e) => e.stopPropagation()}>
										<span>Ваш текущий уровень</span>
									</div>
								)}
							</span>
						</h4>
						<p className={styles.profileUsername}>{username}</p>
					</div>
					<div className={styles.containerMenu}>
						<div className={styles.containerContext}>
							<h5 className={styles.containerContextTitle}>
								Информация
							</h5>
							<p>Почта: {email}</p>
							<span className={styles.separator}></span>
							{birthday && <p>Дата рождения: {birthday}</p>}
							<span className={styles.separator}></span>
							<p>Пройдено маршрутов: {routesCounter}</p>
						</div>

						<div className={styles.containerContext}>
							<h5 className={styles.containerContextTitle}>
								Друзья ({friends.length})
							</h5>
							<div className={styles.friendsList}>
								{displayedFriends.length > 0 ? (
									<>
										{displayedFriends.map((friend) => (
											<div
												key={friend.id}
												className={styles.friendsBody}
												onClick={() =>
													friend.username &&
													navigate(
														`/profile/${friend.username}`
													)
												}>
												<Avatar
													src={friend.avatar}
													size={'small'}
												/>
												<p
													className={
														styles.friendsName
													}>
													{friend.name}
												</p>
											</div>
										))}
									</>
								) : (
									<span className={styles.emptyText}>
										Нет друзей
									</span>
								)}
							</div>
						</div>

						<div className={styles.containerContext}>
							<span className={styles.containerContextTittle}>
								Последние маршруты
							</span>
							<div className={styles.routesList}>
								{recentRoutes.length > 0 ? (
									recentRoutes.map((route) => (
										<div className={styles.routeCards}>
											<RouteCard
												key={route.id}
												route={route}
											/>
											<span
												className={
													styles.separator
												}></span>
										</div>
									))
								) : (
									<span className={styles.emptyText}>
										Нет пройденных маршрутов
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className={styles.containerMobile}>
					<div className={styles.headerMobile}>
						<Avatar src={avatar} size={'large'} />
						<h4 className={styles.profileName}>
							{name}
							<span
								ref={levelRef}
								className={styles.profileLevel}
								onClick={handleLevelClick}>
								{level}
								{showMenu && (
									<div
										className={styles.levelMenu}
										ref={menuRef}
										onClick={(e) => e.stopPropagation()}>
										<span>Ваш текущий уровень</span>
									</div>
								)}
							</span>
						</h4>
						<p className={styles.profileUsername}>{username}</p>
					</div>
					<Button variant={'tertiary'}
					onClick={() => {navigate('/admin')}}>
						Admin panel
					</Button>
					<div className={styles.containerMenu}>
						<div className={styles.containerContext}>
							<h5 className={styles.containerContextTitle}>
								Информация
							</h5>
							<p>Почта: {email}</p>
							<span className={styles.separator}></span>
							{birthday && <p>Дата рождения: {birthday}</p>}
							<span className={styles.separator}></span>
							<p>Пройдено маршрутов: {routesCounter}</p>
						</div>

						<div className={styles.containerContext}>
							<h5 className={styles.containerContextTitle}>
								Друзья ({friends.length})
							</h5>
							<div className={styles.friendsList}>
								{displayedFriends.length > 0 ? (
									<>
										{displayedFriends.map((friend) => (
											<div
												key={friend.id}
												className={styles.friendsBody}
												onClick={() =>
													friend.username &&
													navigate(
														`/profile/${friend.username}`
													)
												}>
												<Avatar
													src={friend.avatar}
													size={'small'}
												/>
												<p
													className={
														styles.friendsName
													}>
													{friend.name}
												</p>
											</div>
										))}
									</>
								) : (
									<span className={styles.emptyText}>
										Нет друзей
									</span>
								)}
							</div>
						</div>

						<div className={styles.containerContext}>
							<span className={styles.containerContextTittle}>
								Последние маршруты
							</span>
							<div className={styles.routesList}>
								{recentRoutes.length > 0 ? (
									recentRoutes.map((route) => (
										<div className={styles.routeCards}>
											<RouteCard
												key={route.id}
												route={route}
											/>
											<span
												className={
													styles.separator
												}></span>
										</div>
									))
								) : (
									<span className={styles.emptyText}>
										Нет пройденных маршрутов
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
