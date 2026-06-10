import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from 'react-router-dom';
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
	NotFoundPage, Privacy,
	ProfilePage,
	RecoveryPasswordPage,
	RegistrationPage,
	RouteEdit,
	RoutesMobilePage,
	SettingsPage,
	Statistic,
	StatisticPage,
	TagsEdit, Terms,
	Workbench,
} from '@pages';
import { useDispatch, useSelector } from '@store';
import { useEffect } from 'react';
import {
	initAuth,
	setInitialized,
} from './services/slices/userSlice/userSlice';
import { selectInitialized } from './services/selectors/userSelectors';
import { getAccessToken, getRefreshToken } from './utils/auth';

export function App() {
	const dispatch = useDispatch();
	const initialized = useSelector(selectInitialized);

	useEffect(() => {
		const accessToken = getAccessToken();
		const refreshToken = getRefreshToken();

		if (!accessToken && !refreshToken) {
			dispatch(setInitialized());
			return;
		}

		dispatch(initAuth());
	}, [dispatch]);

	if (!initialized) {
		return <div>Loading...</div>;
	}

	return <RouterProvider router={router} />;
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
				path: '/privacy',
				element: <Privacy />,
			},
			{
				path: '/terms',
				element: <Terms />,
			},
			{
				element: <ProtectedRoute allowedRoles={['USER', 'ADMIN']} />,
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
						path: '/recommended',
						element: <FilterDesktopPage />,
					},
					{
						path: '/popular',
						element: <FilterDesktopPage />,
					},
					{
						path: '/favorites',
						element: <FilterDesktopPage />,
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
					{
						path: '/admin/statistic',
						element: <Statistic />
					}
				],
			},
			{
				path: '*',
				element: <NotFoundPage />,
			},
		],
	},
]);
