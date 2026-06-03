import { Achievement } from '@components';

import styles from './AchievementPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@store';
import { useEffect } from 'react';

export const AchievementPage = () => {
	const dispatch = useDispatch<AppDispatch>();
	// const { items, loading, error } = useSelector(
	// 	// (state: RootState) => state.achievements
	// );

	useEffect(() => {
		// dispatch(fetchAchievements());
	}, [dispatch]);

	// if (loading) return <div>Загрузка...</div>;
	// if (error) return <div>{error}</div>;
	//
	// return (
	// 	<section className={styles.section}>
	// 		<Achievement achievementsData={items} />
	// 	</section>
	// );
};

export default AchievementPage;
