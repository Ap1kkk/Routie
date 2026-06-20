import React, { useEffect, useState } from 'react';
import { Button, Select } from '@ui';
import { useDispatch, useSelector } from '@store';

import styles from './LeaderBoardPage.module.scss';

import { PeriodKey, PERIODS } from '../../types/Gamification';
import { FriendCard } from '@components';
import { fetchLeaderboard } from '../../services/slices/gamificationSlice/gamificationSlice';

export const LeaderBoardPage: React.FC = () => {
	const dispatch = useDispatch();

	const [activePeriod, setActivePeriod] = useState<PeriodKey>('week');

	const { leaderboard, loading, error } = useSelector(
		(state) => state.gamification
	);

	const entries = leaderboard?.entries || [];

	// Загрузка данных при смене периода
	useEffect(() => {
		const periodMap: Record<PeriodKey, 'WEEK' | 'MONTH' | 'SEASON'> = {
			week: 'WEEK',
			month: 'MONTH',
			season: 'SEASON',
		};

		dispatch(
			fetchLeaderboard({
				period: periodMap[activePeriod],
				limit: 50,
			})
		);
	}, [dispatch, activePeriod]);

	const handlePeriodChange = (period: PeriodKey) => {
		setActivePeriod(period);
	};

	return (
		<section className={styles.container}>
			<div className={styles.headerMenu}>
				<h2 className={styles.headerTitle}>Таблица лидеров</h2>

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

				<Select
					className={styles.selectOptions}
					placeholder='Выберите параметр'
					value='LEVEL'
					options={[
						{ value: 'LEVEL', label: 'Уровень' },
						{ value: 'TOTALXP', label: 'Опыт' },
					]}
					disabled
				/>
			</div>

			{/* Состояния загрузки и ошибки */}
			{loading && (
				<div className={styles.loading}>
					Загрузка таблицы лидеров...
				</div>
			)}
			{error && <div className={styles.error}>Ошибка: {error}</div>}

			{!loading && !error && entries.length === 0 && (
				<div className={styles.empty}>
					В этом периоде пока нет данных
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
								isFriend: false, // можно позже определять по друзьям пользователя
							}}
							variant='standard'
							rank={entry.rank}
							showRank={true}
							showMedal={true}
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
