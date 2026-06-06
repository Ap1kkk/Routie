import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout, ProfileRedirect, ProtectedRoute } from '@components';
import {
	AchievementPage,
	AudioGuidesEdit,
	AuthorizationPage,
	EditProfilePage,
	Error500Page,
	FilterDesktopPage,
	FilterMobilePage,
	LandmarksEdit,
	MainPage,
	MapPage,
	NotFoundPage,
	ProfilePage,
	RecoveryPasswordPage,
	RegistrationPage,
	RouteEdit,
	RoutesMobilePage,
	SettingsPage,
	StatisticPage,
	TagsEdit,
	Workbench,
} from '@pages';

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
				element: <ProtectedRoute allowedRoles={['USER']} />,
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
						element: <ProfileRedirect />,
					},
					//{
					// 	path: '/filter',
					// 	element: <FilterDesktopPage />,
					//},
					// {
					// 	path: '/filter-mobile',
					// 	element: <FilterMobilePage />,
					// },
					{
						path: '/routes',
						element: <RoutesMobilePage />,
					},
					{
						path: '/statistic',
						element: <StatisticPage />,
					},
					{
						path: '/profile/edit',
						element: <EditProfilePage />,
					},
					{
						path: '/achievements',
						element: <AchievementPage />,
					},
				],
			},
			{
				element: <ProtectedRoute allowedRoles={['ADMIN']} />,
				children: [
					{
						path: '/admin',
						element: <Workbench />,
					},
					{
						path: '/admin/landmarks-edit',
						element: <LandmarksEdit />,
					},
					{
						path: '/admin/routes-edit',
						element: <RouteEdit />,
					},
					{
						path: '/admin/tags-edit',
						element: <TagsEdit />,
					},
					{
						path: '/admin/audioguides-edit',
						element: <AudioGuidesEdit />,
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
