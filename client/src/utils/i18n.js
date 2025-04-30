import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import all translations
import enCommon from "../locales/en/common.json"
import enUser from "../locales/en/user.json"
import esCommon from "../locales/es/common.json"
import esUser from "../locales/es/user.json"

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
        user: enUser,
      },
      es: {
        common: esCommon,
        user: esUser,
      },
    },
  })

export default i18n
