import React, { useEffect, useRef, useState } from 'react';
import styles from '../../components/Profile/Profile.module.scss';
import { Avatar, Button, Circle } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../hooks/useDeviceType';
import { RouteCard } from '../RouteCard';
import { Route } from '../../types/Route';
import { FriendCard } from '../FriendCard';

import { ReactComponent as Chevron } from '../../assets/icons/chevron-right.svg';
import { Friend } from '../../types/Friends';

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
	friendAvatars?: Record<string, string>;
	recentRoutes?: Route[];
	routeImages?: Record<string, string>;

	onFriendClick?: (friendId: string) => void;
	onRemoveFriend?: (friendId: string) => void;
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
													friendAvatars = {},          // ← новое
													recentRoutes = [],
													routeImages = {},

													onFriendClick,
													onRemoveFriend,
												}) => {
	const navigate = useNavigate();
	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';

	const [showMenu, setShowMenu] = useState(false);
	const levelRef = useRef<HTMLSpanElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const displayedFriends = friends.slice(0, 4);

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
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [showMenu]);

	const handleFriendCardClick = (friendId: string) => {
		onFriendClick?.(friendId);
	};

	const handleFriendRemove = (friendId: string) => {
		onRemoveFriend?.(friendId);
	};

	return (
		<div className={styles.container}>
			{isMobile ? (
				<div className={styles.containerMobile}>
					<div className={styles.headerMobile}>
						<Avatar src={avatar} size='large' />
						<h4 className={styles.profileName}>
							{name}
							<Circle level={level} size='small' />
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
							<div className={styles.containerContextHeader}>
								<h5 className={styles.containerContextTitle}>
									Друзья ({friends.length})
								</h5>
								<Chevron onClick={() => navigate('/friends')} />
							</div>
							<div className={styles.friendsList}>
								{displayedFriends.length > 0 ? (
									displayedFriends.map((friend) => (
										<FriendCard
											key={friend.id}
											friend={friend}
											avatarSrc={friendAvatars[friend.id]}   // ← добавили
											variant='compact'
											showRemoveButton={true}
											onCardClick={handleFriendCardClick}
											onRemove={handleFriendRemove}
										/>
									))
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
										<div
											key={route.id}
											className={styles.routeCards}>
											<RouteCard
												route={route}
												imageUrl={routeImages[route.id]}
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
						<Avatar src={avatar} size='large' />
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

					<Button
						variant='primary'
						onClick={() => navigate('/admin')}>
						Панель администратора
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
									displayedFriends.map((friend) => (
										<FriendCard
											key={friend.id}
											friend={friend}
											avatarSrc={friendAvatars[friend.id]}   // ← добавили
											variant='standard'
											showRemoveButton={true}
											onCardClick={handleFriendCardClick}
											onRemove={handleFriendRemove}
										/>
									))
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
										<div
											key={route.id}
											className={styles.routeCards}>
											<RouteCard
												route={route}
												imageUrl={routeImages[route.id]}
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