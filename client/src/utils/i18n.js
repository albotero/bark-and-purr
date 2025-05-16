import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import all translations
import enAuth from "../locales/en/auth.json"
import enProfile from "../locales/en/profile.json"
import enNavbar from "../locales/en/navbar.json"
import enFavorites from "../locales/en/favorites.json"
import enHome from "../locales/en/home.json"
import enDiscover from "../locales/en/discover.json"
import enCart from "../locales/en/cart.json"
import enRoutes from "../locales/en/routes.json"
import enErrors from "../locales/en/errors.json"
import enOrders from "../locales/en/orders.json"

import esAuth from "../locales/es/auth.json"
import esProfile from "../locales/es/profile.json"
import esNavbar from "../locales/es/navbar.json"
import esFavorites from "../locales/es/favorites.json"
import esHome from "../locales/es/home.json"
import esDiscover from "../locales/es/discover.json"
import esCart from "../locales/es/cart.json"
import esRoutes from "../locales/es/routes.json"
import esErrors from "../locales/es/errors.json"
import enProduct from "../locales/en/product.json"
import esProduct from "../locales/es/product.json"
import esOrders from "../locales/es/orders.json"
    

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
        discover: enDiscover,
        cart: enCart,
        routes: enRoutes,
        errors: enErrors,
        product: enProduct,
        orders: enOrders
      },
      es: {
        auth: esAuth,
        profile: esProfile,
        navbar: esNavbar,
        favorites: esFavorites,
        home: esHome,
        discover: esDiscover,
        cart: esCart,
        routes: esRoutes,
        errors: esErrors,
        product: esProduct,
        orders: esOrders
      },
    },
  })

export default i18n
