import type { RootState } from '../../store/rootReducer';

export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token && state.auth.user);
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserRoles = (state: RootState) => state.auth.user?.roles ?? [];
export const selectIsDispatcher = (state: RootState) => {
  const roles = state.auth.user?.roles ?? [];
  return roles.includes('Dispatcher') || roles.includes('Admin');
};
export const selectIsDriver = (state: RootState) => (state.auth.user?.roles ?? []).includes('Driver');
