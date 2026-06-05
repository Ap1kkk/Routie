import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
	Route,
	FullRoute,
	RouteCreateRequest,
	RouteUpdateRequest,
	RoutesSearchParams,
	PaginatedRoutes,
	GetRecommendedParams,
} from '../../../types/Route';
import {
	deleteRouteApi,
	searchRoutesApi,
	getFullRouteApi,
	getRecommendedRoutesApi,
	publishRouteApi,
	uploadRouteImagesApi,
	createRouteApi,
	updateRouteApi,
} from '../../../utils/api/RoutesApi';

type TRouteState = {
	currentRoute: FullRoute | null;
	searchResults: PaginatedRoutes | null;
	recommendedRoutes: PaginatedRoutes | null;
	isLoading: boolean;
	error: string | null;
};

const initialState: TRouteState = {
	currentRoute: null,
	searchResults: null,
	recommendedRoutes: null,
	isLoading: false,
	error: null,
};

export const fetchRoute = createAsyncThunk<
	FullRoute,
	string,
	{ rejectValue: string }
>('route/fetchRoute', async (routeId, { rejectWithValue }) => {
	const response = await getFullRouteApi(routeId);
	if (!response.success || response.error)
		return rejectWithValue(response.error?.message || 'Ошибка получения маршрута');

	if (!response.data)
		return rejectWithValue('Данные маршрута не найдены');

	return response.data;
});

export const searchRoutes = createAsyncThunk<
	PaginatedRoutes,
	RoutesSearchParams,
	{ rejectValue: string }
>('route/searchRoutes', async (params, { rejectWithValue }) => {
	const response = await searchRoutesApi(params);
	if (!response.success || response.error)
		return rejectWithValue(response.error?.message || 'Ошибка поиска маршрутов');

	if (!response.data)
		return rejectWithValue('Результаты поиска не найдены');

	return response.data;
});

export const fetchRecommendedRoutes = createAsyncThunk<
	PaginatedRoutes,
	GetRecommendedParams,
	{ rejectValue: string }
>('route/fetchRecommendedRoutes', async (params, { rejectWithValue }) => {
	const response = await getRecommendedRoutesApi(params);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка получения рекомендуемых маршрутов'
		);

	if (!response.data)
		return rejectWithValue('Рекомендуемые маршруты не найдены');

	return response.data;
});

export const createNewRoute = createAsyncThunk<
	Route,
	RouteCreateRequest,
	{ rejectValue: string }
>('route/createRoute', async (data, { rejectWithValue }) => {
	const response = await createRouteApi(data);
	if (!response.success || response.error)
		return rejectWithValue(response.error?.message || 'Ошибка создания маршрута');

	if (!response.data)
		return rejectWithValue('Не удалось создать маршрут');

	return response.data;
});

export const routeUpdate = createAsyncThunk<
	Route,
	{ routeId: string; data: RouteUpdateRequest },
	{ rejectValue: string }
>('route/updateRoute', async ({ routeId, data }, { rejectWithValue }) => {
	const response = await updateRouteApi(routeId, data);
	if (!response.success || response.error)
		return rejectWithValue(response.error?.message || 'Ошибка обновления маршрута');

	if (!response.data)
		return rejectWithValue('Не удалось обновить маршрут');

	return response.data;
});

export const routeDelete = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('route/deleteRoute', async (routeId, { rejectWithValue }) => {
	const response = await deleteRouteApi(routeId);
	if (!response.success || response.error)
		return rejectWithValue(response.error?.message || 'Ошибка удаления маршрута');

	return routeId;
});

export const routePublish = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>('route/publishRoute', async (routeId, { rejectWithValue }) => {
	const response = await publishRouteApi(routeId);
	if (!response.success || response.error)
		return rejectWithValue(response.error?.message || 'Ошибка публикации маршрута');

	return routeId;
});

export const routeImagesUpload = createAsyncThunk<
	any[],
	{ routeId: string; file: File },
	{ rejectValue: string }
>('route/uploadImages', async ({ routeId, file }, { rejectWithValue }) => {
	const response = await uploadRouteImagesApi(routeId, file);
	if (!response.success || response.error)
		return rejectWithValue(
			response.error?.message || 'Ошибка загрузки изображений маршрута'
		);

	if (!response.data)
		return rejectWithValue('Не удалось загрузить изображения');

	return response.data;
});

const routeSlice = createSlice({
	name: 'route',
	initialState,
	reducers: {
		clearRoute: (state) => {
			state.currentRoute = null;
		},
		clearSearchResults: (state) => {
			state.searchResults = null;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRoute.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchRoute.fulfilled, (state, action) => {
				state.isLoading = false;
				state.currentRoute = action.payload;
			})
			.addCase(fetchRoute.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(searchRoutes.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(searchRoutes.fulfilled, (state, action) => {
				state.isLoading = false;
				state.searchResults = action.payload;
			})
			.addCase(searchRoutes.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(fetchRecommendedRoutes.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchRecommendedRoutes.fulfilled, (state, action) => {
				state.isLoading = false;
				state.recommendedRoutes = action.payload;
			})
			.addCase(fetchRecommendedRoutes.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(createNewRoute.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createNewRoute.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(createNewRoute.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(routeUpdate.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(routeUpdate.fulfilled, (state, action) => {
				state.isLoading = false;
				if (state.currentRoute?.id === action.payload.id) {
					state.currentRoute = action.payload as unknown as FullRoute;
				}
			})
			.addCase(routeUpdate.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(routeDelete.fulfilled, (state, action) => {
				if (state.currentRoute?.id === action.payload) {
					state.currentRoute = null;
				}
			})

			.addCase(routePublish.fulfilled, (state, action) => {
				if (state.currentRoute?.id === action.payload) {
					state.currentRoute.isActive = true;
				}
			})

			.addCase(routeImagesUpload.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(routeImagesUpload.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(routeImagesUpload.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			});
	},
});

export const { clearRoute, clearSearchResults, clearError } = routeSlice.actions;
export default routeSlice.reducer;
