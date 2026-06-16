import React, { useState } from 'react';
import { Button, Select } from '@ui';
import styles from './LeaderBoardPage.module.scss';

import { PeriodKey, PERIODS } from '../../types/Gamification';
import { Friend } from '../../types/Friends';
import { FriendCard } from '@components';

const mockLeaders: Friend[] = [
	{
		id: '1',
		name: 'Андрей Смирнов',
		currentLevel: 47,
		totalXp: 28450,
		isFriend: true,
	},
	{
		id: '2',
		name: 'Екатерина Морозова',
		currentLevel: 44,
		totalXp: 25100,
		isFriend: false,
	},
	{
		id: '3',
		name: 'Максим Петров',
		currentLevel: 42,
		totalXp: 21800,
		isFriend: true,
	},
	{
		id: '4',
		name: 'Анна Ковалёва',
		currentLevel: 39,
		totalXp: 18750,
		isFriend: false,
	},
	{
		id: '5',
		name: 'Дмитрий Соколов',
		currentLevel: 37,
		totalXp: 16400,
		isFriend: false,
	},
];

export const LeaderBoardPage: React.FC = () => {
	const [activePeriod, setActivePeriod] = useState<PeriodKey>('week');
	const [selectedParam, setSelectedParam] = useState<'LEVEL' | 'TOTALXP'>(
		'LEVEL'
	);

	const handlePeriodChange = (period: PeriodKey) => {
		setActivePeriod(period);
	};

	const handleParamChange = (value: string) => {
		setSelectedParam(value as 'LEVEL' | 'TOTALXP');
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
					value={selectedParam}
					options={[
						{ value: 'LEVEL', label: 'Уровень' },
						{ value: 'TOTALXP', label: 'Опыт' },
					]}
					onChange={handleParamChange}
				/>
			</div>

			<div className={styles.leaderboardList}>
				{mockLeaders.map((leader, index) => (
					<div key={leader.id} className={styles.leaderboardItem}>
						<FriendCard
							friend={leader}
							variant='standard'
							rank={index+1}
							showMedal={true}
							showRank = {true}
						/>
					</div>
				))}
			</div>
		</section>
	);
};
