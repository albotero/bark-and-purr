import { createContext, useContext, useState } from "react"
import PropTypes from "prop-types"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

const UserProvider = ({ children }) => {
  const getToken = () => localStorage.getItem("token")
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken())
  const { t } = useTranslation("auth")

  // Login
  const login = async (email, pass) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: pass,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Guarda el token en localStorage
      localStorage.setItem("token", data.token)
      setIsAuthenticated(true)

      return { success: true, user: data.user }
    } catch (err) {
      console.error("Login error:", err)
      return { success: false, message: err.message }
    }
  }

  const register = async (name, lastName, email, birthday, password) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surname: name,
          last_name: lastName,
          email,
          birthday,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Registration failed")
      }

      localStorage.setItem("token", data.token)
      setIsAuthenticated(true)
      Swal.fire({
        icon: "success",
        title: "Registration successful",
        text: "You have been registered successfully.",
        timer: 2000,
        showConfirmButton: true,
      })
      return { success: true, user: data }
    } catch (err) {
      console.error("Registration error:", err)
      return { success: false, message: err.message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)

    Swal.fire({
      icon: "success",
      title: t("logout.title"),
      text: t("logout.text"),
      confirmButtonText: t("logout.button"),
      timer: 2000,
      showConfirmButton: true,
    })
  }

  const context = {
    isAuthenticated,
    setIsAuthenticated,
    getToken,
    login,
    register,
    logout,
  }

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default UserProvider
