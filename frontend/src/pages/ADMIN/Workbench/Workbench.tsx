import React from 'react';

import { ReactComponent as User } from '../../../assets/icons/user.svg';
import { ReactComponent as Marker } from '../../../assets/icons/marker.svg';
import { ReactComponent as Route } from '../../../assets/icons/route.svg';
import { ReactComponent as Achievements } from '../../../assets/icons/achievements.svg';

import styles from './Workbench.module.scss';

export const Workbench = () => {
	return (
		<section className={styles.section}>
			<button className={styles.editButton}>
				<Marker />
			</button>
			<button className={styles.editButton}>
				<Route />
			</button>
			<button className={styles.editButton}>
				<User />
			</button>
			<button className={styles.editButton}>
				<Achievements />
			</button>
		</section>
	);
};

export default Workbench;
