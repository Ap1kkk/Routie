import { useEffect } from 'react';
import { useDispatch, useSelector } from '@store';

import { Achievement } from '@components';
import styles from './AchievementPage.module.scss';
import { fetchAchievements } from '../../services/slices/gamificationSlice/gamificationSlice';

export const AchievementPage = () => {
	const dispatch = useDispatch();

	const { userAchievements, loading, error } = useSelector(
		(state) => state.gamification
	);

	useEffect(() => {
		dispatch(fetchAchievements());
	}, [dispatch]);

	if (loading)
		return <div className={styles.loading}>Загрузка достижений...</div>;
	if (error) return <div className={styles.error}>Ошибка: {error}</div>;

	return (
		<section className={styles.section}>
			<Achievement achievementsData={userAchievements} />
		</section>
	);
};

export default AchievementPage;
