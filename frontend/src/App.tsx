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
	FindFriendPage,
	FriendsPage,
	LandmarksEdit,
	LeaderBoardPage,
	MainPage,
	MapPage,
	NotFoundPage,
	NotificationPage,
	Privacy,
	ProfilePage,
	RecoveryPasswordPage,
	RegistrationPage,
	RouteEdit,
	RouteEditCheckpoints,
	RoutesMobilePage,
	SessionsPage,
	SettingsPage,
	Statistic,
	StatisticPage,
	TagsEdit,
	Terms,
	Workbench,
} from '@pages';
import { useEffect, useState } from 'react';
import { authApi } from './utils/api/AuthApi';
import { clearTokens, getAccessToken, getRefreshToken } from './utils/auth';
import { useDispatch } from '@store';
import {
	clearUserProfile,
	setMyProfile,
} from './services/slices/profileSlice/profileSlice';
import {
	setAuthenticated,
	setInitialized,
} from './services/slices/authSlice/authSlice';
import { getMyProfileApi } from './utils/api/ProfileApi';

export function App() {
	const [initialized, setAppInitialized] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const init = async () => {
			try {
				let me;

				if (getAccessToken()) {
					me = await authApi.getUser();
				}

				if ((!me || !me.success) && getRefreshToken()) {
					const refreshed = await authApi.refreshToken();

					if (refreshed) {
						me = await authApi.getUser();
					}
				}

				if (me?.success && me.data) {
					const profile = await getMyProfileApi();

					dispatch(setAuthenticated(true));

					if (profile.success && profile.data) {
						dispatch(setMyProfile(profile.data));
					}
				} else {
					clearTokens();

					dispatch(setAuthenticated(false));
					dispatch(clearUserProfile());
				}
			} finally {
				dispatch(setInitialized(true));
				setAppInitialized(true);
			}
		};

		init();
	}, []);

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
						path: '/friends',
						element: <FriendsPage />,
					},
					{
						path: '/friends/find',
						element: <FindFriendPage />,
					},
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
					{
						path: '/recommended-mobile',
						element: <RoutesMobilePage />,
					},
					{
						path: '/favorites-mobile',
						element: <RoutesMobilePage />,
					},
					{
						path: '/popular-mobile',
						element: <RoutesMobilePage />,
					},
					{
						path: '/routes',
						element: <RoutesMobilePage />,
					},
					{
						path: '/filter-mobile',
						element: <FilterMobilePage />,
					},
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
						path: '/settings/sessions',
						element: <SessionsPage />,
					},
					{
						path: '/settings/notifications',
						element: <NotificationPage />,
					},
					{
						path: '/settings/statistic',
						element: <StatisticPage />,
					},
					{
						path: '/settings/friends-leader-board',
						element: <LeaderBoardPage />,
					},
					{
						path: '/settings/all-leader-board',
						element: <LeaderBoardPage />,
					},
					{
						path: '/settings/achievements',
						element: <AchievementPage />,
					},
					{
						path: '/profile/edit',
						element: <EditProfilePage />,
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
						path: '/admin/routes-edit/checkpoints',
						element: <RouteEditCheckpoints />,
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
						element: <Statistic />,
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
