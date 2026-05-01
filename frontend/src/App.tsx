import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout, ProtectedRoute } from '@components';
import {
	AchievementPage,
	AuthorizationPage,
	EditProfilePage,
	Error500Page,
	FilterDesktopPage,
	FilterMobilePage,
	MainPage,
	MapPage,
	NotFoundPage,
	ProfilePage,
	RecoveryPasswordPage,
	RegistrationPage,
	RoutesMobilePage,
	SettingsPage,
	StatisticPage,
} from '@pages';

function checkAuth(): boolean {
	const token = localStorage.getItem('accessToken');
	return !!token;
}

export const router = createBrowserRouter([
	{
		element: <Layout />,
		errorElement: <Error500Page />,
		children: [
			{
				path: '/',
				element: <Navigate to='/routie' replace />,
			},
			{
				path: '/login',
				element: <AuthorizationPage />,
			},
			{
				path: '/registration',
				element: <RegistrationPage />,
			},
			{
				path: '/recovery-page',
				element: <RecoveryPasswordPage />,
			},
			{
				element: <ProtectedRoute isAuthenticated={true} />,
				children: [
					{
						path: '/routie',
						element: <MainPage />,
					},
					{
						path: '/map/:routeId',
						element: <MapPage />,
					},
					{
						path: '/settings',
						element: <SettingsPage />,
					},
					{
						path: '/profile/:username',
						element: <ProfilePage />,
					},
					{
						path: '/profile',
						element: (
							<Navigate
								to={`/profile/${getCurrentUsername()}`}
								replace
							/>
						),
					},
					{
						path: '/filter',
						element: <FilterDesktopPage />,
					},
					{
						path: '/filter-mobile',
						element: <FilterMobilePage />,
					},
					{
						path: '/routes',
						element: <RoutesMobilePage />,
					},
					{
						path: '/statistic',
						element: <StatisticPage />,
					},
					{
						path: '/achievement',
						element: <AchievementPage />,
					},
					{
						path: '/profile/edit',
						element: <EditProfilePage />,
					},
				],
			},
			{
				path: '*',
				element: <NotFoundPage />,
			},
		],
	},
]);

function getCurrentUsername() {
	const username = localStorage.getItem('username');
	if (username) return username;
}
