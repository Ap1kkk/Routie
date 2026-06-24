import React, { useEffect, useState } from 'react';
import { Button, Select } from '@ui';
import { useDispatch, useSelector } from '@store';

import styles from './LeaderBoardPage.module.scss';

import { PeriodKey, PERIODS } from '../../types/Gamification';
import { FriendCard } from '@components';
import { fetchFriendsLeaderboard } from '../../services/slices/gamificationSlice/gamificationSlice';

export const LeaderBoardPage: React.FC = () => {
	const dispatch = useDispatch();

	const [activePeriod, setActivePeriod] = useState<PeriodKey>('week');
	const [sortBy, setSortBy] = useState<
		'TOTAL_XP' | 'TOTAL_DISTANCE_METERS' | 'TOTAL_ROUTES_COMPLETED'
	>('TOTAL_XP');

	const { friendsLeaderboard, loading, error } = useSelector(
		(state) => state.gamification
	);

	const entries = friendsLeaderboard?.entries || [];

	// Загрузка данных при изменении периода или сортировки
	useEffect(() => {
		const periodMap: Record<PeriodKey, 'WEEK' | 'MONTH' | 'SEASON'> = {
			week: 'WEEK',
			month: 'MONTH',
			season: 'SEASON',
		};

		dispatch(
			fetchFriendsLeaderboard({
				period: periodMap[activePeriod],
				limit: 50,
				sort: sortBy,
			})
		);
	}, [dispatch, activePeriod, sortBy]);

	const handlePeriodChange = (period: PeriodKey) => {
		setActivePeriod(period);
	};

	const handleSortChange = (value: string) => {
		setSortBy(
			value as
				| 'TOTAL_XP'
				| 'TOTAL_DISTANCE_METERS'
				| 'TOTAL_ROUTES_COMPLETED'
		);
	};

	return (
		<section className={styles.container}>
			<div className={styles.headerMenu}>
				<h2 className={styles.headerTitle}>Таблица лидеров друзей</h2>

				{/* Переключение периода */}
				<div className={styles.buttonMenu}>
					{PERIODS.map((period) => (
						<Button
							key={period.key}
							children={period.label}
							variant='secondary'
							className={`${styles.periodButton} ${
								activePeriod === period.key ? styles.active : ''
							}`}
							onClick={() => handlePeriodChange(period.key)}
						/>
					))}
				</div>

				{/* Выбор параметра сортировки */}
				<Select
					className={styles.selectOptions}
					placeholder='Сортировать по'
					value={sortBy}
					options={[
						{ value: 'TOTAL_XP', label: 'По опыту' },
						{
							value: 'TOTAL_DISTANCE_METERS',
							label: 'По дистанции',
						},
						{
							value: 'TOTAL_ROUTES_COMPLETED',
							label: 'По маршрутам',
						},
					]}
					onChange={handleSortChange}
				/>
			</div>

			{/* Состояния */}
			{loading && (
				<div className={styles.loading}>
					Загрузка лидерборда друзей...
				</div>
			)}
			{error && <div className={styles.error}>Ошибка: {error}</div>}

			{!loading && !error && entries.length === 0 && (
				<div className={styles.empty}>
					У вас пока нет друзей или нет данных за этот период
				</div>
			)}

			<div className={styles.leaderboardList}>
				{entries.map((entry) => (
					<div key={entry.userId} className={styles.leaderboardItem}>
						<FriendCard
							friend={{
								id: entry.userId,
								name: entry.name,
								currentLevel: entry.currentLevel,
								totalXp: entry.totalXp,
								isFriend: true,
							}}
							variant='standard'
							rank={entry.rank}
							showRank={true}
							showMedal={true}
							showRemoveButton={false}
							onCardClick={(id) =>
								console.log('Перейти в профиль:', id)
							}
						/>
					</div>
				))}
			</div>
		</section>
	);
};
