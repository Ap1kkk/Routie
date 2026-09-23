import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { getUserStatistics } from '../../services/slices/profileSlice/profileSlice';
import { Statistic } from '@components';

import styles from './StatisticPage.module.scss';

export const StatisticPage = () => {
	const dispatch = useDispatch();

	const { statistics, loading, error } = useSelector(
		(state) => state.profile
	);

	const [activePeriod, setActivePeriod] = useState<
		'day' | 'week' | 'month' | 'year'
	>('month');

	useEffect(() => {
		const today = new Date().toISOString().split('T')[0];
		let startDate = today;

		if (activePeriod === 'week') {
			const weekAgo = new Date();
			weekAgo.setDate(weekAgo.getDate() - 7);
			startDate = weekAgo.toISOString().split('T')[0];
		} else if (activePeriod === 'month') {
			const monthAgo = new Date();
			monthAgo.setMonth(monthAgo.getMonth() - 1);
			startDate = monthAgo.toISOString().split('T')[0];
		} else if (activePeriod === 'year') {
			const yearAgo = new Date();
			yearAgo.setFullYear(yearAgo.getFullYear() - 1);
			startDate = yearAgo.toISOString().split('T')[0];
		}

		dispatch(getUserStatistics({ startDate, endDate: today }));
	}, [dispatch, activePeriod]);

	// Безопасное форматирование чисел
	const formatMeters = (meters: number) => {
		if (!meters || isNaN(meters)) return '0 м';
		return Math.round(meters).toLocaleString('ru-RU') + ' м';
	};

	const formatMinutes = (seconds: number) => {
		if (!seconds || isNaN(seconds)) return '0 мин';
		const minutes = Math.floor(seconds / 60);
		return minutes > 0 ? `${minutes} мин` : 'Менее минуты';
	};

	const formatHoursMinutes = (seconds: number) => {
		if (!seconds || isNaN(seconds)) return '0ч 0мин';
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}ч ${minutes}мин`;
	};

	const statisticData = statistics
		? [
				{
					title: 'Всего пройдено метров',
					value: formatMeters(statistics.totalDistanceMeters),
				},
				{
					title: 'Всего пройдено шагов',
					value: (statistics.estimatedTotalSteps || 0).toLocaleString(
						'ru-RU'
					),
				},
				{
					title: 'Общее время пройденных маршрутов',
					value: formatHoursMinutes(statistics.totalDurationSeconds),
				},
				{
					title: 'Пройдено точек маршрута',
					value: (
						statistics.totalCheckpointsReached || 0
					).toLocaleString('ru-RU'),
				},
				{
					title: 'Средняя длина маршрутов',
					value: formatMeters(statistics.avgRouteLengthMeters),
				},
				{
					title: 'Среднее время маршрута',
					value: formatMinutes(statistics.avgSessionDurationSeconds),
				},
		  ]
		: [];

	return (
		<section className={styles.section}>
			<Statistic
				statisticData={statisticData}
				activePeriod={activePeriod}
				onPeriodChange={setActivePeriod}
			/>
		</section>
	);
};
