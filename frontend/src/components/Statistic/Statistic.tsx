import React from 'react';
import styles from './Statistic.module.scss';
import { StatisticCard } from '../StatisticCard';
import { Button } from '@ui';
import { PeriodKey, PERIODS, StatisticCardData } from '../../types/statistic';

interface StatisticProps {
	title?: string;
	statisticData?: StatisticCardData[];
	activePeriod: PeriodKey;
	onPeriodChange: (period: PeriodKey) => void;
}

export const Statistic: React.FC<StatisticProps> = ({
	title = 'Статистика',
	statisticData = [],
	activePeriod,
	onPeriodChange,
}) => {
	return (
		<div className={styles.statisticContainer}>
			<h2 className={styles.statisticTitle}>{title}</h2>

			{/* Фильтры по периоду */}
			<div className={styles.statisticFilterContainer}>
				{PERIODS.map((period) => (
					<Button
						key={period.key}
						variant='secondary'
						className={`${styles.statisticButton} ${
							activePeriod === period.key ? styles.active : ''
						}`}
						onClick={() => onPeriodChange(period.key)}
						children={period.label}
					/>
				))}
			</div>

			{/* Карточки статистики */}
			<div className={styles.statisticContent}>
				{statisticData.length > 0 ? (
					statisticData.map((item, index) => (
						<StatisticCard key={index} title={item.title}>
							{item.value}
						</StatisticCard>
					))
				) : (
					<p className={styles.emptyText}>
						Нет данных за выбранный период
					</p>
				)}
			</div>
		</div>
	);
};
