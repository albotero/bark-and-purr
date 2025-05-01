import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import all translations
import enAuth from "../locales/en/auth.json"
import enProfile from "../locales/en/profile.json"
import enNavbar from "../locales/en/navbar.json"
import enFavorites from "../locales/en/favorites.json"
import enHome from "../locales/en/home.json"

import esAuth from "../locales/es/auth.json"
import esProfile from "../locales/es/profile.json"
import esNavbar from "../locales/es/navbar.json"
import esFavorites from "../locales/es/favorites.json"
import esHome from "../locales/es/home.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        auth: enAuth,
        profile: enProfile,
        navbar: enNavbar,
        favorites: enFavorites,
        home: enHome,
      },
      es: {
        auth: esAuth,
        profile: esProfile,
        navbar: esNavbar,
        favorites: esFavorites,
        home: esHome,
      },
    },
  })

export default i18n
