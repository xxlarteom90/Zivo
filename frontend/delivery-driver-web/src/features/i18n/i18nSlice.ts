import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/rootReducer';
import { DEFAULT_LANGUAGE, type LanguageCode, LANGUAGES } from './languages';
import { TRANSLATIONS } from './translations';

const STORAGE_KEY = 'driver.language';

function readInitialLanguage(): LanguageCode {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && LANGUAGES.some((l) => l.code === stored)) {
    return stored as LanguageCode;
  }
  // Migration: previously stored display name (e.g. "Română").
  if (stored) {
    const match = LANGUAGES.find((l) => l.name === stored);
    if (match) {
      window.localStorage.setItem(STORAGE_KEY, match.code);
      return match.code;
    }
  }
  return DEFAULT_LANGUAGE;
}

export interface I18nState {
  language: LanguageCode;
}

const initialState: I18nState = {
  language: readInitialLanguage()
};

const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LanguageCode>) {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, action.payload);
        document.documentElement.setAttribute('lang', action.payload);
      }
    }
  }
});

export const { setLanguage } = i18nSlice.actions;

export const selectLanguage = (state: RootState) => state.i18n.language;

export function translate(language: LanguageCode, key: string, vars?: Record<string, string | number>): string {
  const raw =
    TRANSLATIONS[language]?.[key]
    ?? TRANSLATIONS.en[key]
    ?? TRANSLATIONS.ro[key]
    ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name) => (vars[name] !== undefined ? String(vars[name]) : `{${name}}`));
}

export default i18nSlice.reducer;
