import "./styles/bs-overrides.scss"
import "bootstrap/dist/js/bootstrap.bundle.min"
import "./styles/index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom" // ojo: 'react-router-dom'
import { I18nextProvider } from "react-i18next"

import App from "./App.jsx"
import i18n from "./utils/i18n.js"

import UserProvider from "./context/UserContext"
import { CartProvider } from "./context/CartContext"
import ThemeProvider from "./context/ThemeContext.jsx"
import { FavoritesProvider } from "./context/FavoritesContext.jsx" 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <UserProvider>
          <CartProvider>
            <FavoritesProvider> {/* favorite context*/}
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </FavoritesProvider>
          </CartProvider>
        </UserProvider>
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>
)
