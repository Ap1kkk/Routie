import { RootState } from '@store';

export const selectCurrentRoute = (state: RootState) => state.route.currentRoute;
export const selectSearchRoutes = (state: RootState) => state.route.searchResults;
export const selectRecommendedRoutes = (state: RootState) => state.route.recommendedRoutes;
export const selectDailyRoute = (state: RootState) => state.route.dailyRoute;
export const selectRouteLoading = (state: RootState) => state.route.isLoading;
export const selectRouteError = (state: RootState) => state.route.error;