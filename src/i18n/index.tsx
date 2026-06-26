import React, { createContext, useContext } from 'react';
import { LanguageCode } from '../models/types';
import { translations, TranslationKey } from './translations';

type TranslateFn = (key: TranslationKey, vars?: Record<string, string | number>) => string;

interface I18nContextValue {
  language: LanguageCode;
  t: TranslateFn;
}

const I18nContext = createContext<I18nContextValue>({
  language: 'en',
  t: (key) => key,
});

function interpolate(value: string, vars?: Record<string, string | number>): string {
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{${name}}`,
  );
}

export function I18nProvider({
  language,
  children,
}: {
  language: LanguageCode;
  children: React.ReactNode;
}) {
  const t: TranslateFn = (key, vars) => {
    const table = translations[language] ?? translations.en;
    const value = table[key] ?? translations.en[key] ?? key;
    return interpolate(value, vars);
  };
  return <I18nContext.Provider value={{ language, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

export type { TranslationKey };
