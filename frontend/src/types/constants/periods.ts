export const PERIODS = [
	{ key: 'day', label: 'За день' },
	{ key: 'week', label: 'За неделю' },
	{ key: 'month', label: 'За месяц' },
	{ key: 'year', label: 'За год' },
] as const;

export type PeriodKey = (typeof PERIODS)[number]['key'];
