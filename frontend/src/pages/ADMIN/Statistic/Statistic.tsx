import React, { useEffect, useState } from 'react';
import {
	OverviewStatistics,
	PagedResponse,
	SessionsSummary,
	SessionStatistics,
	SessionStatus,
} from '../../../types/Statistics';
import { Button, Input } from '@ui';

import styles from './Statistic.module.scss';
import { statisticsApi } from '../../../utils/api/Statistics';

const getDefaultDates = () => {
	const end = new Date();

	const start = new Date();
	start.setMonth(start.getMonth() - 1);

	return {
		startDate: start.toISOString().slice(0, 10),
		endDate: end.toISOString().slice(0, 10),
	};
};

export const Statistic = () => {
	const [overview, setOverview] = useState<OverviewStatistics | null>(null);
	const [summary, setSummary] = useState<SessionsSummary | null>(null);
	const [sessions, setSessions] =
		useState<PagedResponse<SessionStatistics> | null>(null);
	const [loading, setLoading] = useState(true);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [userId, setUserId] = useState('');
	const [routeId, setRouteId] = useState('');
	const [status, setStatus] = useState('');

	const defaultDates = getDefaultDates();

	const [overviewFilters, setOverviewFilters] = useState({
		startDate: defaultDates.startDate,
		endDate: defaultDates.endDate,
	});

	const [summaryFilters, setSummaryFilters] = useState({
		startDate: defaultDates.startDate,
		endDate: defaultDates.endDate,
	});

	const [sessionFilters, setSessionFilters] = useState({
		startDate: defaultDates.startDate,
		endDate: defaultDates.endDate,
		userId: '',
		routeId: '',
		status: '',
	});

	const loadOverview = async () => {
		const response = await statisticsApi.getOverview(overviewFilters);

		if (response.success && response.data) {
			setOverview(response.data);
		}
	};

	const loadSummary = async () => {
		const response = await statisticsApi.getSessionsSummary(summaryFilters);

		if (response.success && response.data) {
			setSummary(response.data);
		}
	};

	const loadSessions = async () => {
		const response = await statisticsApi.getSessions({
			...sessionFilters,
			status: sessionFilters.status
				? (sessionFilters.status as SessionStatus)
				: undefined,
			userId: sessionFilters.userId || undefined,
			routeId: sessionFilters.routeId || undefined,
			page: 0,
			size: 10,
		});

		if (response.success && response.data) {
			setSessions(response.data);
		}
	};

	useEffect(() => {
		const init = async () => {
			try {
				await Promise.all([
					loadOverview(),
					loadSummary(),
					loadSessions(),
				]);
			} finally {
				setLoading(false);
			}
		};

		init();
	}, []);

	const loadStatistics = async () => {
		setLoading(true);

		try {
			const commonFilters = {
				startDate: startDate || undefined,
				endDate: endDate || undefined,
			};

			const [overviewRes, summaryRes, sessionsRes] = await Promise.all([
				statisticsApi.getOverview(commonFilters),

				statisticsApi.getSessionsSummary({
					...commonFilters,
					routeId: routeId || undefined,
				}),

				statisticsApi.getSessions({
					...commonFilters,
					userId: userId || undefined,
					routeId: routeId || undefined,
					status:
						status === '' ? undefined : (status as SessionStatus),
					page: 0,
					size: 10,
				}),
			]);

			if (overviewRes.success && overviewRes.data) {
				setOverview(overviewRes.data);
			}

			if (summaryRes.success && summaryRes.data) {
				setSummary(summaryRes.data);
			}

			if (sessionsRes.success && sessionsRes.data) {
				setSessions(sessionsRes.data);
			}
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Загрузка...</div>;
	}

	return (
		<section className={styles.section}>
			<h3 className={styles.title}>Статистика</h3>

			{loading && <p className={styles.loading}>Загрузка...</p>}

			<div className={styles.filters}>
				<Input
					label='От'
					type='date'
					value={overviewFilters.startDate}
					onChange={(e) =>
						setOverviewFilters((prev) => ({
							...prev,
							startDate: e.target.value,
						}))
					}
				/>

				<Input
					label='До'
					type='date'
					value={overviewFilters.endDate}
					onChange={(e) =>
						setOverviewFilters((prev) => ({
							...prev,
							endDate: e.target.value,
						}))
					}
				/>
			</div>
			<div className={styles.cards}>
				<h2>Сводка по пользователям</h2>
				<div className={styles.card}>
					<p>Всего пользователей</p>
					<span className={styles.cardValue}>
						{overview?.totalUsers ?? 0}
					</span>
				</div>

				<div className={styles.card}>
					<p>Активных за 30 дней</p>
					<span className={styles.cardValue}>
						{overview?.activeUsersLast30Days ?? 0}
					</span>
				</div>

				<div className={styles.card}>
					<p>Пройдено маршрутов</p>
					<span className={styles.cardValue}>
						{overview?.totalRoutesCompleted ?? 0}
					</span>
				</div>

				<div className={styles.card}>
					<p>Средний уровень</p>
					<span className={styles.cardValue}>
						{overview?.averageLevel?.toFixed(1) ?? 0}
					</span>
				</div>

				<div className={styles.card}>
					<p>Общий XP</p>
					<span className={styles.cardValue}>
						{overview?.totalXpEarned ?? 0}
					</span>
				</div>

				<div className={styles.card}>
					<p>Общая дистанция</p>
					<span className={styles.cardValue}>
						{((overview?.totalDistanceMeters ?? 0) / 1000).toFixed(
							1
						)}
						км
					</span>
				</div>
			</div>

			<div className={styles.cards}>
				<h2>Сводка по сессиям</h2>
				<div className={styles.card}>
					<p>Всего сессий</p>
					<span className={styles.cardValue}>
						{summary?.totalSessions ?? 0}
					</span>
				</div>

				<div className={styles.card}>
					<p>Завершено</p>
					<span className={styles.cardValue}>
						{summary?.finishedCount ?? 0}
					</span>
				</div>

				<div className={styles.card}>
					<p>Прервано</p>
					<span className={styles.cardValue}>
						{summary?.abortedCount ?? 0}
					</span>
				</div>

				<div className={styles.card}>
					<p>Активных</p>
					<span className={styles.cardValue}>
						{summary?.activeCount ?? 0}
					</span>
				</div>

				<div className={styles.card}>
					<p>Успешность</p>
					<span className={styles.cardValue}>
						{summary?.completionRate?.toFixed(1) ?? 0}%
					</span>
				</div>
			</div>
			<div className={styles.cards}>
				<h2>Последние сессии</h2>
				<div className={styles.filters}>
					<Input
						label='От'
						type='date'
						value={sessionFilters.startDate}
						onChange={(e) =>
							setSessionFilters((prev) => ({
								...prev,
								startDate: e.target.value,
							}))
						}
					/>

					<Input
						label='До'
						type='date'
						value={sessionFilters.endDate}
						onChange={(e) =>
							setSessionFilters((prev) => ({
								...prev,
								endDate: e.target.value,
							}))
						}
					/>

					<Input
						label='User ID'
						value={sessionFilters.userId}
						onChange={(e) =>
							setSessionFilters((prev) => ({
								...prev,
								userId: e.target.value,
							}))
						}
					/>

					<Input
						label='Route ID'
						value={sessionFilters.routeId}
						onChange={(e) =>
							setSessionFilters((prev) => ({
								...prev,
								routeId: e.target.value,
							}))
						}
					/>

					<Button variant='primary' onClick={loadSessions}>
						Применить
					</Button>
				</div>
				<table className={styles.table}>
					<thead className={styles.tableHead}>
						<tr className={styles.tableRow}>
							<th className={styles.tableHeader}>Пользователь</th>
							<th className={styles.tableHeader}>Маршрут</th>
							<th className={styles.tableHeader}>Статус</th>
							<th className={styles.tableHeader}>Начало</th>
							<th className={styles.tableHeader}>Дистанция</th>
							<th className={styles.tableHeader}>Скорость</th>
						</tr>
					</thead>

					<tbody className={styles.tableBody}>
						{sessions?.content?.map((session) => (
							<tr key={session.id} className={styles.tableRow}>
								<td className={styles.tableCell}>
									{session.userDisplayName}
								</td>

								<td className={styles.tableCell}>
									{session.routeTitle}
								</td>

								<td className={styles.tableCell}>
									<span
										className={`${styles.status} ${
											session.status === 'ACTIVE'
												? styles.active
												: session.status === 'FINISHED'
												? styles.finished
												: styles.aborted
										}`}>
										{session.status}
									</span>
								</td>

								<td className={styles.tableCell}>
									{new Date(
										session.startedAt
									).toLocaleString()}
								</td>

								<td className={styles.tableCell}>
									{((session.totalDistanceMeters ?? 0) / 1000).toFixed(2)} км
								</td>

								<td className={styles.tableCell}>
									{(session.avgSpeedKmh ?? 0).toFixed(1)} км/ч
								</td>
							</tr>
						))}

						{sessions?.content?.length === 0 && (
							<tr className={styles.tableRow}>
								<td colSpan={6} className={styles.emptyState}>
									Сессии отсутствуют
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
};
