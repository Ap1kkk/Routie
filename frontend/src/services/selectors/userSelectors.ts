import { RootState } from '@store';

export const selectUser = (state : RootState) => state.user.data;

export const selectUserRoles = (state: RootState) => state.user.roles;

export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export const selectIsLoading = (state: RootState) => state.user.isLoading;

export const selectIsAdmin = (state: RootState) => state.user.roles.includes('ADMIN');

export const selectInitialized = (state: RootState) => state.user.initialized;

export const selectIsAuthInitialized = (state: RootState) =>
	state.user.initialized;