import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import pathCustom from "app/utils/langFromPath";

const languageDetector = new LanguageDetector();
languageDetector.addDetector(pathCustom);

const BASE_URL = import.meta.env.VITE_SERVER_URL;
i18n
  .use(HttpBackend)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ru"], // add your available languages
    debug: import.meta.env.VITE_DEBUG === "true", // optional, logs detection

    detection: {
      order: [
        "pathCustom",
        // "localStorage", // use saved choice first
        // "cookie", // optional, if you store cookie
        // "navigator", // check browser accept-languages
        // "htmlTag", // <html lang="">
        // "querystring", // ?lang=ru
      ],
      pathCustom: 1,
      lookupQuerystring: "lang",
      caches: ["localStorage", "cookie"],
    },

    backend: {
      loadPath: `${BASE_URL}/api/content/translation?lang={{lng}}`,
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
