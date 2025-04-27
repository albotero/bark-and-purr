import "bootstrap/dist/css/bootstrap.min.css"
import "./styles/index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import App from "./App.jsx"
import UserProvider from "./context/UserContext";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
     <BrowserRouter>
      <App />
     </BrowserRouter>
    </UserProvider>
  </StrictMode>
)
