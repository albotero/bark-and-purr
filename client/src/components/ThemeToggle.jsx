import { BsMoonStarsFill, BsSunFill } from "react-icons/bs"
import Button from "react-bootstrap/esm/Button"
import { useTheme } from "../context/ThemeContext"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="outline-accent" onClick={toggleTheme} aria-label="Toggle dark mode" className="mx-3">
      {theme === "dark" ? <BsSunFill /> : <BsMoonStarsFill />}
    </Button>
  )
}
