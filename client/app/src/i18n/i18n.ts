import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

i18n
	.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		supportedLngs: ["en", "ru"], // add your available languages
		// debug: import.meta.env.DEV, // optional, logs detection

		detection: {
			order: [
				"localStorage", // use saved choice first
				"cookie", // optional, if you store cookie
				"navigator", // check browser accept-languages
				"htmlTag", // <html lang="">
				"querystring", // ?lang=ru
			],
			lookupQuerystring: "lang",
			caches: ["localStorage", "cookie"],
		},

		backend: {
			loadPath: `${BASE_URL}/api/translation?lang={{lng}}`,
		},

		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
