import { Achievement } from '@components';
import { ACHI_MOCK } from '../../mocks/achievments';

import styles from './AchievementPage.module.scss';

export const AchievementPage = () => {
	return (
		<section className={styles.section}>
			<Achievement achievementsData={ACHI_MOCK} />
		</section>
	);
};

export default AchievementPage;
