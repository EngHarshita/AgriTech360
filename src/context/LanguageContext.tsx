import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import enTranslations from '../locales/en/common.json';
import hiTranslations from '../locales/hi/common.json';

export type SupportedLanguage = 'hi' | 'en';

export type TranslationDictionary = typeof enTranslations;

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyPath: string, fallback?: string) => string;
  isHindi: boolean;
  formatCurrency: (amount: number) => string;
  formatNumberLocale: (num: number) => string;
  formatDateLocale: (dateString: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'agritech_preferred_language';

const translationsMap: Record<SupportedLanguage, any> = {
  hi: hiTranslations,
  en: enTranslations,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Hindi ('hi') for first-time farmer audience unless previously selected
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'hi') {
      return saved as SupportedLanguage;
    }
    // Default to Hindi for rural and farmer-first UX
    return 'hi';
  });

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  /**
   * Helper to retrieve nested keys using dot notation like "common.appName" or "actions.getCropAdvice"
   */
  const t = useCallback(
    (keyPath: string, fallback?: string): string => {
      const keys = keyPath.split('.');
      let current: any = translationsMap[language];

      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          // Fallback to English dictionary if key missing in current
          let enCurrent: any = translationsMap.en;
          for (const enKey of keys) {
            if (enCurrent && typeof enCurrent === 'object' && enKey in enCurrent) {
              enCurrent = enCurrent[enKey];
            } else {
              enCurrent = undefined;
              break;
            }
          }
          return typeof enCurrent === 'string' ? enCurrent : (fallback || keyPath);
        }
      }

      return typeof current === 'string' ? current : (fallback || keyPath);
    },
    [language]
  );

  const formatCurrency = useCallback(
    (amount: number): string => {
      try {
        const locale = language === 'hi' ? 'hi-IN' : 'en-IN';
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(amount);
      } catch {
        return `₹${amount.toLocaleString('en-IN')}`;
      }
    },
    [language]
  );

  const formatNumberLocale = useCallback(
    (num: number): string => {
      try {
        const locale = language === 'hi' ? 'hi-IN' : 'en-IN';
        return new Intl.NumberFormat(locale).format(num);
      } catch {
        return num.toString();
      }
    },
    [language]
  );

  const formatDateLocale = useCallback(
    (dateString: string): string => {
      try {
        const d = new Date(dateString);
        const locale = language === 'hi' ? 'hi-IN' : 'en-IN';
        return d.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return dateString;
      }
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isHindi: language === 'hi',
        formatCurrency,
        formatNumberLocale,
        formatDateLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
