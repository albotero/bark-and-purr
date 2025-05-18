import { createContext, useContext, useState } from "react"
import PropTypes from "prop-types"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { useApi } from "../hooks/useApi"

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

const UserProvider = ({ children }) => {
  const getToken = () => localStorage.getItem("token")
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken())
  const [fetchData] = useApi()
  const { t } = useTranslation("auth")

  // Login
  const login = async (email, password) => {
    try {
      const { error, token, user } = await fetchData({
        method: "POST",
        endpoint: "auth/login",
        body: { email, password },
      })
      if (error) throw new Error(error)
      // Guarda el token en localStorage
      localStorage.setItem("token", token)
      setIsAuthenticated(true)
      return { success: true, user }
    } catch (err) {
      console.error("Login error:", err)
      return { success: false, message: err.message }
    }
  }

  const register = async (name, lastName, email, birthday, password) => {
    try {
      const { error, token, user } = await fetchData({
        method: "POST",
        endpoint: "auth/register",
        body: {
          surname: name,
          last_name: lastName,
          email,
          birthday,
          password,
        },
      })
      if (error) throw new Error(error)
      // Guarda el token en localStorage
      localStorage.setItem("token", token)
      setIsAuthenticated(true)
      return { success: true, user }
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
