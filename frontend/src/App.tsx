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
	FilterMobilePage, FindFriendPage,
	FriendsPage,
	LandmarksEdit,
	LeaderBoardPage,
	MainPage,
	MapPage,
	NotFoundPage,
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
import { useDispatch, useSelector } from '@store';
import { useEffect } from 'react';
import {
	initAuth,
	setInitialized,
} from './services/slices/authSlice/authSlice';
import { selectInitialized } from './services/selectors/userSelectors';
import { routeApi } from './utils/api/RoutesApi';
import { fileApi } from './utils/api/FileApi';
import { getAccessToken, getRefreshToken } from './utils/auth';
import { Route } from './types/Route';

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
				element: <Navigate to='/login' replace />,
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
						element: <FindFriendPage />
					},
					{
						path: '/leader-board',
						element: <LeaderBoardPage />,
					},
					{
						path: '/routie',
						loader: mainPageLoader,
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
						loader: routesLoader,
						element: <RoutesMobilePage />,
					},
					{
						path: '/favorites-mobile',
						loader: routesLoader,
						element: <RoutesMobilePage />,
					},
					{
						path: '/popular-mobile',
						loader: routesLoader,
						element: <RoutesMobilePage />,
					},
					{
						path: '/routes',
						loader: routesLoader,
						element: <RoutesMobilePage />,
					},
					{
						path: '/filter-mobile',
						element: <FilterMobilePage />,
					},
					{
						path: '/recommended',
						loader: routesLoader,
						element: <FilterDesktopPage />,
					},
					{
						path: '/popular',
						loader: routesLoader,
						element: <FilterDesktopPage />,
					},
					{
						path: '/favorites',
						loader: routesLoader,
						element: <FilterDesktopPage />,
					},
					{
						path: '/settings/sessions',
						element: <SessionsPage />,
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

export async function mainPageLoader() {
	const [dailyRes, recommendedRes, popularRes] = await Promise.all([
		routeApi.getDaily(),
		routeApi.getRecommended({ page: 0, size: 8 }),
		routeApi.getPopular({ limit: 6 }),
	]);

	if (
		!dailyRes.success ||
		!recommendedRes.success ||
		!popularRes.success ||
		!dailyRes.data ||
		!recommendedRes.data ||
		!popularRes.data
	) {
		throw new Error('Ошибка загрузки данных');
	}

	const dailyRoute = dailyRes.data;
	const recommendedRoutes = recommendedRes.data;
	const popularRoutes = popularRes.data;

	const allRoutes = [...recommendedRoutes.content, ...popularRoutes];

	const images = await Promise.all(
		allRoutes.map(async (route) => {
			if (!route.images?.length) {
				return [route.id, null];
			}

			try {
				const response = await fileApi.download(route.images[0].id);
				const imageUrl =
					response.success && response.data ? response.data : null;
				return [route.id, imageUrl];
			} catch (err) {
				console.error(
					`Ошибка загрузки изображения для ${route.id}:`,
					err
				);
				return [route.id, null];
			}
		})
	);

	return {
		dailyRoute,
		recommendedRoutes,
		popularRoutes,
		routeImages: Object.fromEntries(images),
	};
}

export async function routesLoader({ request }: { request: Request }) {
	try {
		const url = new URL(request.url);
		const pathname = url.pathname;

		let routes: Route[] = [];
		let title = 'Маршруты';
		let isFavoritesPage = false;

		if (pathname.includes('/favorites')) {
			const response = await routeApi.getFavorites({
				page: 0,
				size: 20,
			});

			if (!response.success || !response.data) {
				throw new Error('Не удалось загрузить избранное');
			}

			routes = response.data.content ?? [];
			title = 'Избранное';
			isFavoritesPage = true;
		} else if (pathname.includes('/recommended')) {
			const response = await routeApi.getRecommended({
				page: 0,
				size: 20,
			});

			if (!response.success || !response.data) {
				throw new Error('Не удалось загрузить рекомендации');
			}

			routes = response.data.content ?? [];
			title = 'Рекомендованные';
		} else if (pathname.includes('/popular')) {
			const response = await routeApi.getPopular({
				limit: 20,
			});

			if (!response.success || !response.data) {
				throw new Error('Не удалось загрузить популярные');
			}

			routes = response.data;
			title = 'Популярные';
		} else {
			const response = await routeApi.search({
				page: 0,
				size: 20,
			});

			if (!response.success || !response.data) {
				throw new Error('Не удалось загрузить маршруты');
			}

			routes = response.data.content ?? [];
			title = 'Маршруты';
		}

		const imagePromises = routes.map(async (route) => {
			if (!route.images?.length) {
				return [route.id, null];
			}

			try {
				const response = await fileApi.download(route.images[0].id);
				const imageUrl =
					response.success && response.data ? response.data : null;
				return [route.id, imageUrl];
			} catch (err) {
				console.error(`Ошибка загрузки изображения ${route.id}:`, err);
				return [route.id, null];
			}
		});

		const routeImages = Object.fromEntries(
			await Promise.all(imagePromises)
		);

		return {
			routes,
			routeImages,
			title,
			isFavoritesPage,
		};
	} catch (error) {
		console.error('routesLoader error:', error);
		throw new Response('Ошибка загрузки маршрутов', { status: 500 });
	}
}
