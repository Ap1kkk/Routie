import { Outlet } from 'react-router-dom';
import { useDeviceType } from '../../hooks/useDeviceType';
import { Header } from '../Header/DesktopHeader';
import { Footer } from '../Footer/DesktopFooter';
import { MobileFooter } from '../Footer/MobileFooter';
import { MobileHeader } from '../Header/MobileHeader';

import styles from './Layout.module.scss';

export const Layout = () => {
	const deviceType = useDeviceType();
	const isMobile = deviceType === 'mobile';

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
