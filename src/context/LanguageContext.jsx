import React, { createContext, useContext, useState, useEffect } from 'react';
import idTranslations from '../i18n/id.json';
import enTranslations from '../i18n/en.json';

const translations = { id: idTranslations, en: enTranslations };
const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

// Helper: get nested key from object, e.g. "auth.vipLogin"
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [detected, setDetected] = useState(false);

  // Auto-detect language on first load
  useEffect(() => {
    // 1. Check localStorage first (user preference)
    const savedLang = localStorage.getItem('scorpio88_lang');
    if (savedLang) {
      setLang(savedLang);
      setDetected(true);
      return;
    }

    // 2. Try browser language
    const browserLang = navigator.language || navigator.userLanguage || '';
    if (browserLang.toLowerCase().startsWith('id')) {
      setLang('id');
      localStorage.setItem('scorpio88_lang', 'id');
      setDetected(true);
      return;
    }

    // 3. Try IP geolocation (free API)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_code === 'ID') {
          setLang('id');
          localStorage.setItem('scorpio88_lang', 'id');
        } else {
          setLang('en');
          localStorage.setItem('scorpio88_lang', 'en');
        }
      })
      .catch(() => {
        // Fallback to English
        setLang('en');
        localStorage.setItem('scorpio88_lang', 'en');
      })
      .finally(() => setDetected(true));
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('scorpio88_lang', newLang);
  };

  // Translation function: t('auth.vipLogin')
  const t = (key) => {
    return getNestedValue(translations[lang], key) || getNestedValue(translations['en'], key) || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
