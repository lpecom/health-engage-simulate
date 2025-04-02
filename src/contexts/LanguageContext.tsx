
import React, { createContext, useContext, useState } from 'react';
import { LanguageCode, TranslateParams, translations } from '@/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translate: (key: string, params?: TranslateParams) => string;
}

// Create the Language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create a provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use browser's preferred language or default to Spanish
  const getBrowserLanguage = (): LanguageCode => {
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'es' || browserLang === 'pt' || browserLang === 'it' || browserLang === 'de') {
      return browserLang as LanguageCode;
    }
    return 'es'; // Default to Spanish
  };

  // Get saved language from localStorage or use browser language
  const getSavedLanguage = (): LanguageCode => {
    const saved = localStorage.getItem('language');
    if (saved === 'es' || saved === 'pt' || saved === 'it' || saved === 'de') {
      return saved as LanguageCode;
    }
    return getBrowserLanguage();
  };

  const [language, setLanguageState] = useState<LanguageCode>(getSavedLanguage);

  // Save language preference to localStorage when it changes
  const setLanguage = (newLanguage: LanguageCode) => {
    localStorage.setItem('language', newLanguage);
    setLanguageState(newLanguage);
  };

  // Translation function
  const translate = (key: string, params?: TranslateParams): string => {
    const currentTranslations = translations[language];
    let translation = currentTranslations[key] || key;

    if (params) {
      // Replace parameters in the translation string
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a hook for easier context usage
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
