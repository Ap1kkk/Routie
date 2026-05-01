import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import {
	Route,
	CreateRouteData,
	UpdateRouteData,
	RoutesResponse,
} from '../../../types/route';

import {
	getAllRoutes,
	getRouteById,
	createRoute,
	updateRoute,
	deleteRoute,
	getRoutesByTag,
	getRoutesByDistanceRange,
	searchRoutes,
} from '../../../utils/api/route-api';

interface RoutesState {
	routes: Route[];
	currentRoute: Route | null;
	loading: boolean;
	error: string | null;
	successMessage: string | null;
	total: number;
	page: number;
	limit: number;
}

const initialState: RoutesState = {
	routes: [],
	currentRoute: null,
	loading: false,
	error: null,
	successMessage: null,
	total: 0,
	page: 1,
	limit: 10,
};

/** Загрузка всех маршрутов с фильтрацией и пагинацией */
export const fetchAllRoutes = createAsyncThunk(
	'routes/fetchAllRoutes',
	async (
		{
			page = 1,
			limit = 10,
			filters,
		}: { page?: number; limit?: number; filters?: any } = {},
		{ rejectWithValue }
	) => {
		try {
			return await getAllRoutes(filters, page, limit);
		} catch (error: any) {
			return rejectWithValue(
				error.message || 'Ошибка загрузки маршрутов'
			);
		}
	}
);

/** Загрузка маршрута по ID */
export const fetchRouteById = createAsyncThunk(
	'routes/fetchRouteById',
	async (id: string, { rejectWithValue }) => {
		try {
			return await getRouteById(id);
		} catch (error: any) {
			return rejectWithValue(error.message || 'Ошибка загрузки маршрута');
		}
	}
);

/** Создание нового маршрута */
export const addNewRoute = createAsyncThunk(
	'routes/addNewRoute',
	async (data: CreateRouteData, { rejectWithValue }) => {
		try {
			return await createRoute(data);
		} catch (error: any) {
			return rejectWithValue(error.message || 'Ошибка создания маршрута');
		}
	}
);

/** Обновление существующего маршрута */
export const editRoute = createAsyncThunk(
	'routes/editRoute',
	async (
		{ id, data }: { id: string; data: UpdateRouteData },
		{ rejectWithValue }
	) => {
		try {
			return await updateRoute(id, data);
		} catch (error: any) {
			return rejectWithValue(
				error.message || 'Ошибка обновления маршрута'
			);
		}
	}
);

/** Удаление маршрута */
export const removeRoute = createAsyncThunk(
	'routes/removeRoute',
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await deleteRoute(id);
			return { id, ...response };
		} catch (error: any) {
			return rejectWithValue(error.message || 'Ошибка удаления маршрута');
		}
	}
);

/** Загрузка маршрутов по тегу */
export const fetchRoutesByTag = createAsyncThunk(
	'routes/fetchRoutesByTag',
	async (tagId: string, { rejectWithValue }) => {
		try {
			return await getRoutesByTag(tagId);
		} catch (error: any) {
			return rejectWithValue(
				error.message || 'Ошибка загрузки маршрутов по тегу'
			);
		}
	}
);

/** Загрузка маршрутов по диапазону расстояния */
export const fetchRoutesByDistanceRange = createAsyncThunk(
	'routes/fetchRoutesByDistanceRange',
	async (
		{
			minDistance,
			maxDistance,
		}: { minDistance: number; maxDistance: number },
		{ rejectWithValue }
	) => {
		try {
			return await getRoutesByDistanceRange(minDistance, maxDistance);
		} catch (error: any) {
			return rejectWithValue(
				error.message || 'Ошибка загрузки маршрутов по расстоянию'
			);
		}
	}
);

/** Поиск маршрутов по названию */
export const searchRoutesThunk = createAsyncThunk(
	'routes/searchRoutes',
	async (searchTerm: string, { rejectWithValue }) => {
		try {
			return await searchRoutes(searchTerm);
		} catch (error: any) {
			return rejectWithValue(error.message || 'Ошибка поиска маршрутов');
		}
	}
);

const routesSlice = createSlice({
	name: 'routes',
	initialState,
	reducers: {
		clearMessages: (state) => {
			state.error = null;
			state.successMessage = null;
		},
		clearCurrentRoute: (state) => {
			state.currentRoute = null;
		},
		clearRoutes: (state) => {
			state.routes = [];
		},
		resetRoutesState: () => initialState,
		setPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload;
		},
		setLimit: (state, action: PayloadAction<number>) => {
			state.limit = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// fetchAllRoutes
			.addCase(fetchAllRoutes.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchAllRoutes.fulfilled,
				(state, action: PayloadAction<RoutesResponse>) => {
					state.loading = false;
					state.routes = action.payload.data;
					state.total = action.payload.total;
					state.page = action.payload.page;
					state.limit = action.payload.limit;
				}
			)
			.addCase(fetchAllRoutes.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// fetchRouteById
			.addCase(fetchRouteById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchRouteById.fulfilled,
				(state, action: PayloadAction<Route>) => {
					state.loading = false;
					state.currentRoute = action.payload;
				}
			)
			.addCase(fetchRouteById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// addNewRoute
			.addCase(addNewRoute.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.successMessage = null;
			})
			.addCase(
				addNewRoute.fulfilled,
				(state, action: PayloadAction<Route>) => {
					state.loading = false;
					state.routes.unshift(action.payload);
					state.successMessage = 'Маршрут успешно создан!';
				}
			)
			.addCase(addNewRoute.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// editRoute
			.addCase(editRoute.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.successMessage = null;
			})
			.addCase(
				editRoute.fulfilled,
				(state, action: PayloadAction<Route>) => {
					state.loading = false;
					const index = state.routes.findIndex(
						(route) => route.id === action.payload.id
					);
					if (index !== -1) {
						state.routes[index] = action.payload;
					}
					if (state.currentRoute?.id === action.payload.id) {
						state.currentRoute = action.payload;
					}
					state.successMessage = 'Маршрут успешно обновлен!';
				}
			)
			.addCase(editRoute.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// removeRoute
			.addCase(removeRoute.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.successMessage = null;
			})
			.addCase(
				removeRoute.fulfilled,
				(
					state,
					action: PayloadAction<{ id: string; message: string }> // Изменено id с number на string
				) => {
					state.loading = false;
					state.routes = state.routes.filter(
						(route) => route.id !== action.payload.id
					);
					if (state.currentRoute?.id === action.payload.id) {
						state.currentRoute = null;
					}
					state.successMessage = action.payload.message;
				}
			)
			.addCase(removeRoute.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// fetchRoutesByTag
			.addCase(fetchRoutesByTag.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchRoutesByTag.fulfilled,
				(state, action: PayloadAction<Route[]>) => {
					state.loading = false;
					state.routes = action.payload;
					state.total = action.payload.length;
				}
			)
			.addCase(fetchRoutesByTag.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// fetchRoutesByDistanceRange
			.addCase(fetchRoutesByDistanceRange.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchRoutesByDistanceRange.fulfilled,
				(state, action: PayloadAction<Route[]>) => {
					state.loading = false;
					state.routes = action.payload;
					state.total = action.payload.length;
				}
			)
			.addCase(fetchRoutesByDistanceRange.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// searchRoutesThunk
			.addCase(searchRoutesThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				searchRoutesThunk.fulfilled,
				(state, action: PayloadAction<Route[]>) => {
					state.loading = false;
					state.routes = action.payload;
					state.total = action.payload.length;
				}
			)
			.addCase(searchRoutesThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export const {
	clearMessages,
	clearCurrentRoute,
	clearRoutes,
	resetRoutesState,
	setPage,
	setLimit,
} = routesSlice.actions;

export default routesSlice.reducer;
