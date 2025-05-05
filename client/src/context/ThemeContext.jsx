import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    setTheme(savedTheme)
    document.documentElement.setAttribute("data-bs-theme", savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-bs-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  const context = { theme, toggleTheme }

  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

export default ThemeProvider
