import { RootState } from '@store';

export const selectUser = (state : RootState) => state.auth.data;

export const selectUserRoles = (state: RootState) => state.auth.roles;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectIsLoading = (state: RootState) => state.auth.isLoading;

export const selectIsAdmin = (state: RootState) => state.auth.roles.includes('ADMIN');

export const selectInitialized = (state: RootState) => state.auth.initialized;

export const selectIsAuthInitialized = (state: RootState) =>
	state.auth.initialized;

export const selectAuthError = (state: RootState) => state.auth.loginError;