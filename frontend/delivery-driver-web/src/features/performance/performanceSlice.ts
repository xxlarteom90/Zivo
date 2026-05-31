import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DriverPerformanceDto, PerformancePeriod } from '../../entities/performance';
import { normalizeApiError } from '../../services/apiClient';
import { performanceApi } from '../../services/performanceApi';
import type { RootState } from '../../store/rootReducer';

export interface PerformanceState {
  period: PerformancePeriod;
  data: DriverPerformanceDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: PerformanceState = {
  period: 'Today',
  data: null,
  loading: false,
  error: null
};

export const fetchPerformance = createAsyncThunk<DriverPerformanceDto, PerformancePeriod, { rejectValue: string }>(
  'performance/fetch',
  async (period, { rejectWithValue }) => {
    try {
      return await performanceApi.get(period);
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    setPeriod(state, action: PayloadAction<PerformancePeriod>) {
      state.period = action.payload;
    },
    clearPerformance(state) {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load performance data.';
      });
  }
});

export const { setPeriod, clearPerformance } = performanceSlice.actions;

export const selectPerformancePeriod = (state: RootState) => state.performance.period;
export const selectPerformanceData = (state: RootState) => state.performance.data;
export const selectPerformanceLoading = (state: RootState) => state.performance.loading;
export const selectPerformanceError = (state: RootState) => state.performance.error;

export default performanceSlice.reducer;
