import "bootstrap/dist/css/bootstrap.min.css"
import "./styles/index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { I18nextProvider } from "react-i18next"
import App from "./App.jsx"
import i18n from "./utils/i18n.js"
import UserProvider from "./context/UserContext"
import { CartProvider } from "./context/CartContext"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </I18nextProvider>
  </StrictMode>
)
