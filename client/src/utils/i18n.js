import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import all translations
import enCommon from "../locales/en/common.json"
import enProfile from "../locales/en/profile.json"
import esCommon from "../locales/es/common.json"
import esProfile from "../locales/es/profile.json"

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
      },
      es: {
        common: esCommon,
        profile: esProfile,
      },
    },
  })

export default i18n
