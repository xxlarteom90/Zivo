// Supported language codes mapped to display names shown in the language picker.
export const LANGUAGES = [
  { code: 'az', name: 'Azərbaycanca' },
  { code: 'cs', name: 'Čeština' },
  { code: 'et', name: 'Eesti' },
  { code: 'en', name: 'English' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'hu', name: 'Magyar' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'ro', name: 'Română' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'fi', name: 'Suomi' },
  { code: 'sv', name: 'Svenska' }
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'ro';

export type TranslationDict = Record<string, string>;
