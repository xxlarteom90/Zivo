import type { RootState } from '../../store/rootReducer';

export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token && state.auth.user);
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
