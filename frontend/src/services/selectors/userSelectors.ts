import { RootState } from '@store';

export const selectUser = (state: RootState) => state.user.data;
export const selectIsAuthenticated = (state: RootState) =>
	state.user.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) =>
	state.user.isAuthChecked;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectLoginError = (state: RootState) => state.user.loginError;
export const selectRegisterError = (state: RootState) =>
	state.user.registerError;
export const selectUserError = (state: RootState) =>
	state.user.loginError || state.user.registerError;

export const selectUserRoles = (state: RootState) =>
	state.user.roles;

export const selectIsAdmin = (state: RootState) =>
	state.user.roles.includes('ADMIN');
