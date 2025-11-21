'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Locale, defaultLocale } from './config';
import en from '@/messages/en.json';
import zh from '@/messages/zh.json';

type Messages = typeof en;

const messages: Record<Locale, Messages> = {
  en,
  zh,
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  messages: Messages;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Load saved locale from localStorage
    const saved = localStorage.getItem('preferred-locale') as Locale | null;
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLocaleState(saved);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'zh') {
        setLocaleState('zh');
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferred-locale', newLocale);
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = messages[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() || `{${paramKey}}`;
      });
    }

    return value;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, messages: messages[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export function useTranslations(namespace?: string) {
  const { t, locale, messages } = useLocale();

  const scopedT = (key: string, params?: Record<string, string | number>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return t(fullKey, params);
  };

  return { t: scopedT, locale, messages };
}
