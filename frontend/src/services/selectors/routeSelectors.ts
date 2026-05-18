import { RootState } from '@store';

export const selectAllRoutes = (state: RootState) => state.routes.routes;
export const selectCurrentRoute = (state: RootState) =>
	state.routes.currentRoute;
export const selectRoutesLoading = (state: RootState) => state.routes.loading;
export const selectRoutesError = (state: RootState) => state.routes.error;
export const selectRoutesTotal = (state: RootState) => state.routes.total;
