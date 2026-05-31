import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/rootReducer';
import { normalizeApiError } from '../../services/apiClient';
import {
  getPreferences,
  updatePreferences,
  type UpdateUserPreferencesRequest,
  type UserPreferencesDto
} from '../../services/preferencesApi';
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from '../i18n/languages';
import { setLanguage } from '../i18n/i18nSlice';

const APPEARANCE_KEY = 'driver.appearance';
const REDUCED_MOTION_KEY = 'driver.reducedMotion';
const VEHICLE_KEY = 'driver.vehicleType';
const NAV_KEY = 'driver.navApp';

export type Appearance = 'system' | 'light' | 'dark';
export type Vehicle = 'car' | 'bike' | 'foot';
export type NavApp = 'Waze' | 'Google Maps' | 'Apple Maps';

interface PreferencesState {
  appearance: Appearance;
  reducedMotion: boolean;
  vehicleType: Vehicle;
  navigationApp: NavApp;
  loading: boolean;
  saving: boolean;
  error: string | null;
  hydrated: boolean;
}

function readLocal<T>(key: string, fallback: T, valid?: (v: string) => boolean): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  if (valid && !valid(raw)) return fallback;
  return raw as unknown as T;
}

const initialState: PreferencesState = {
  appearance: readLocal<Appearance>(APPEARANCE_KEY, 'system', (v) => ['system', 'light', 'dark'].includes(v)),
  reducedMotion: readLocal<string>(REDUCED_MOTION_KEY, '0') === '1',
  vehicleType: readLocal<Vehicle>(VEHICLE_KEY, 'car', (v) => ['car', 'bike', 'foot'].includes(v)),
  navigationApp: readLocal<NavApp>(NAV_KEY, 'Google Maps', (v) => ['Waze', 'Google Maps', 'Apple Maps'].includes(v)),
  loading: false,
  saving: false,
  error: null,
  hydrated: false
};

function applyToLocalStorage(dto: UserPreferencesDto) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(APPEARANCE_KEY, dto.appearance);
  window.localStorage.setItem(REDUCED_MOTION_KEY, dto.reducedMotion ? '1' : '0');
  window.localStorage.setItem(VEHICLE_KEY, dto.vehicleType);
  window.localStorage.setItem(NAV_KEY, dto.navigationApp);
}

export const fetchPreferences = createAsyncThunk<UserPreferencesDto, void, { rejectValue: string }>(
  'preferences/fetch',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const dto = await getPreferences();
      applyToLocalStorage(dto);
      if (LANGUAGES.some((l) => l.code === dto.language) && dto.language) {
        dispatch(setLanguage(dto.language as LanguageCode));
      } else {
        dispatch(setLanguage(DEFAULT_LANGUAGE));
      }
      return dto;
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

export const savePreferences = createAsyncThunk<UserPreferencesDto, UpdateUserPreferencesRequest, { rejectValue: string }>(
  'preferences/save',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const dto = await updatePreferences(payload);
      applyToLocalStorage(dto);
      if (payload.language && LANGUAGES.some((l) => l.code === dto.language)) {
        dispatch(setLanguage(dto.language as LanguageCode));
      }
      return dto;
    } catch (error) {
      return rejectWithValue(normalizeApiError(error).message);
    }
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    resetPreferences: () => initialState,
    setAppearanceLocal(state, action: PayloadAction<Appearance>) {
      state.appearance = action.payload;
      if (typeof window !== 'undefined') window.localStorage.setItem(APPEARANCE_KEY, action.payload);
    },
    setReducedMotionLocal(state, action: PayloadAction<boolean>) {
      state.reducedMotion = action.payload;
      if (typeof window !== 'undefined') window.localStorage.setItem(REDUCED_MOTION_KEY, action.payload ? '1' : '0');
    },
    setVehicleLocal(state, action: PayloadAction<Vehicle>) {
      state.vehicleType = action.payload;
      if (typeof window !== 'undefined') window.localStorage.setItem(VEHICLE_KEY, action.payload);
    },
    setNavAppLocal(state, action: PayloadAction<NavApp>) {
      state.navigationApp = action.payload;
      if (typeof window !== 'undefined') window.localStorage.setItem(NAV_KEY, action.payload);
    }
  },
  extraReducers: (builder) => {
    const applyDto = (state: PreferencesState, dto: UserPreferencesDto) => {
      state.appearance = (['system', 'light', 'dark'].includes(dto.appearance) ? dto.appearance : 'system') as Appearance;
      state.reducedMotion = dto.reducedMotion;
      state.vehicleType = (['car', 'bike', 'foot'].includes(dto.vehicleType) ? dto.vehicleType : 'car') as Vehicle;
      state.navigationApp = (['Waze', 'Google Maps', 'Apple Maps'].includes(dto.navigationApp) ? dto.navigationApp : 'Google Maps') as NavApp;
    };

    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.hydrated = true;
        applyDto(state, action.payload);
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load preferences.';
      })
      .addCase(savePreferences.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(savePreferences.fulfilled, (state, action) => {
        state.saving = false;
        applyDto(state, action.payload);
      })
      .addCase(savePreferences.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to save preferences.';
      });
  }
});

export const {
  resetPreferences,
  setAppearanceLocal,
  setReducedMotionLocal,
  setVehicleLocal,
  setNavAppLocal
} = preferencesSlice.actions;

export const selectPreferences = (state: RootState) => state.preferences;
export const selectAppearance = (state: RootState) => state.preferences.appearance;
export const selectReducedMotion = (state: RootState) => state.preferences.reducedMotion;
export const selectVehicleType = (state: RootState) => state.preferences.vehicleType;
export const selectNavigationApp = (state: RootState) => state.preferences.navigationApp;
export const selectPreferencesSaving = (state: RootState) => state.preferences.saving;

export default preferencesSlice.reducer;
