import React from 'react';
import { Profile } from '@components';

import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
	return (
		<section className={styles.section}>
			<Profile/>
		</section>
	);
};
