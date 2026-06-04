import { Outlet } from 'react-router-dom';
import { useDeviceType } from '../../hooks/useDeviceType';
import { Header } from '../Header/DesktopHeader';
import { Footer } from '../Footer/DesktopFooter';
import { MobileFooter } from '../Footer/MobileFooter';
import { MobileHeader } from '../Header/MobileHeader';
import { useDispatch, useSelector } from '@store';
import { selectIsAuthChecked } from '../../services/selectors/userSelectors';
import { useEffect } from 'react';
import {
	fetchUser,
	setAuthChecked,
} from '../../services/slices/userSlice/userSlice';

import styles from './Layout.module.scss';

export const Layout = () => {
	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';
	const dispatch = useDispatch();
	const isAuthChecked = useSelector(selectIsAuthChecked);

	useEffect(() => {
		if (!isAuthChecked) {
			dispatch(fetchUser())
				.unwrap()
				.catch(() => {
					dispatch(setAuthChecked(true));
				});
		}
	}, [dispatch, isAuthChecked]);

	return (
		<div className={styles.layout}>
			{isMobile ? <MobileHeader /> : <Header />}
			<main className={styles.content}>
				<Outlet />
			</main>
			{isMobile ? <MobileFooter /> : <Footer />}
		</div>
	);
};
