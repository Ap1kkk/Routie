import React, { useState } from 'react';
import styles from './Statistic.module.scss';
import { StatisticCard } from '../StatisticCard';
import { Button } from '@ui';
import { StatisticCardData } from '../../types/statistic';
import { PeriodKey, PERIODS } from '../../types/constants/periods';

interface StatisticProps {
	title?: string;
	statisticData?: StatisticCardData[];
}

export const Statistic: React.FC<StatisticProps> = ({ statisticData = [] }) => {
	const [activePeriod, setActivePeriod] = useState<PeriodKey>('day')

	const handlePeriodChange = (period: PeriodKey) => {
		setActivePeriod(period);
		console.log(`Выбран период: ${period}`);
	};

	return (
		<div className={styles.statisticContainer}>
			<h2 className={styles.statisticTitle}>Статистика</h2>
			<div className={styles.statisticFilterContainer}>
				{PERIODS.map((period) => (
					<Button
						key={period.key}
						variant='primary'
						className={`${styles.statisticButton} ${
							activePeriod === period.key ? styles.active : ''
						}`}
						onClick={() => handlePeriodChange(period.key)}
						children={period.label}
					/>
				))}
			</div>
			<div className={styles.statisticContent}>
				{statisticData.map((item, index) => (
					<StatisticCard key={index} title={item.title}>
						{item.value}
					</StatisticCard>
				))}
			</div>
		</div>
	);
};
