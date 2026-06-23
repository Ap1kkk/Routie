import { RootState } from '@store';

export const selectCurrentRoute = (state: RootState) => state.routes.currentRoute;
export const selectSearchRoutes = (state: RootState) => state.routes.searchResults;
export const selectRecommendedRoutes = (state: RootState) => state.routes.recommendedRoutes;
export const selectDailyRoute = (state: RootState) => state.routes.dailyRoute;
export const selectRouteLoading = (state: RootState) => state.routes.isLoading;
export const selectRouteError = (state: RootState) => state.routes.error;