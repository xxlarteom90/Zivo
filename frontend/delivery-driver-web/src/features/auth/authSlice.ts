import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AuthenticatedUser, LoginRequest } from '../../entities/auth';
import { login as loginApi } from '../../services/authApi';
import { normalizeApiError, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../../services/apiClient';

interface AuthState {
  token: string | null;
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string | null;
}

function readStoredUser(): AuthenticatedUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthenticatedUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  user: readStoredUser(),
  loading: false,
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (request: LoginRequest, { rejectWithValue }) => {
    try {
      return await loginApi(request);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.accessToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Login failed.';
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
