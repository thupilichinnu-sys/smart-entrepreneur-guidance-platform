import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, TranslationKeys } from '../data/translations';
import { Language } from '../types/auth';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  lowDataMode: boolean;
  setLowDataMode: (val: boolean) => void;
  toggleLowDataMode: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('segp_lang') as Language) || 'en';
  });

  const [lowDataMode, setLowDataModeState] = useState<boolean>(() => {
    return localStorage.getItem('segp_low_data') === 'true';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('segp_lang', lang);
  };

  const setLowDataMode = (val: boolean) => {
    setLowDataModeState(val);
    localStorage.setItem('segp_low_data', val ? 'true' : 'false');
  };

  const toggleLowDataMode = () => {
    setLowDataMode(!lowDataMode);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      lowDataMode,
      setLowDataMode,
      toggleLowDataMode
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
