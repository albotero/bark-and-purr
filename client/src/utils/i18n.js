import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import all translations
import enCommon from "../locales/en/common.json"
import enProfile from "../locales/en/profile.json"
import enNavbar from "../locales/en/navbar.json"
import enFavorites from "../locales/en/favorites.json"

import esCommon from "../locales/es/common.json"
import esProfile from "../locales/es/profile.json"
import esNavbar from "../locales/es/navbar.json"
import esFavorites from "../locales/es/favorites.json"

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
        common: enCommon,
        profile: enProfile,
        navbar: enNavbar,
        favorites: enFavorites,  
      },
      es: {
        common: esCommon,
        profile: esProfile,
        navbar: esNavbar,
        favorites: esFavorites, 
      },
    },
  })

export default i18n
