import React, { useEffect } from 'react';
import { Profile } from '@components';

import styles from './ProfilePage.module.scss';
import { useDispatch } from '@store';
import { getMyProfile } from '../../services/slices/profileSlice/profileSlice';

export const ProfilePage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getMyProfile());
	}, [dispatch]);

	return (
		<section className={styles.section}>
			<Profile
				name={Profile.name}
			/>
		</section>
	);
};