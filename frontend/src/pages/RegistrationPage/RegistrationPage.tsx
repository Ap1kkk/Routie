import React from 'react';
import { RegistrationForm } from '@components';

import styles from './RegistrationPage.module.scss';

export const RegistrationPage: React.FC = () => {
	return (
		<section className={styles.container}>
			<RegistrationForm />
		</section>
	);
};
