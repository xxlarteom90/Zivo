import { useCallback } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectLanguage, translate } from './i18nSlice';

/**
 * Reactive translation hook. The returned `t(key, vars?)` will re-render the
 * component whenever the active language changes in Redux. Supports `{var}`
 * placeholders inside translated strings.
 */
export function useTranslation() {
  const language = useAppSelector(selectLanguage);
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(language, key, vars),
    [language]
  );
  return { t, language } as const;
}
