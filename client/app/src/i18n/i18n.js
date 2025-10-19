import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector'
const BASE_URL = import.meta.env.VITE_SERVER_URL

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'cookie', 'querystring',],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'lang',
    },
    backend: {
      loadPath: `${BASE_URL}/api/translations?lang={{lng}}`,
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;  