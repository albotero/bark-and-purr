import "../styles/Navbar.css"
import { NavLink, Link, useNavigate } from "react-router-dom"
import Container from "react-bootstrap/esm/Container"
import Nav from "react-bootstrap/esm/Nav"
import BsNavbar from "react-bootstrap/esm/Navbar"
import { useUser } from "../context/UserContext"
import { CartCounter } from "../components/CartCounter"
import { useTranslation } from "react-i18next"
import ThemeToggle from "./ThemeToggle"

const Navbar = () => {
  const { isAuthenticated, logout } = useUser()
  const { t } = useTranslation("navbar")

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const linkClassName = ({ isActive }) => "nav-link" + (isActive ? " active" : "")

  return (
    <BsNavbar expand="lg" variant="dark" className="bg-primary">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          <img src="/logo.png" alt="Logo" width="60" height="60" />
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BsNavbar.Collapse>
          {/* Links at the left */}
          <Nav className="me-auto">
            <NavLink to="/" className={linkClassName}>
              {t("home")}
            </NavLink>
            <NavLink to="/discover" className={linkClassName}>
              {t("discover")}
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/user/publications" className={linkClassName}>
                {t("Products")}
              </NavLink>
            )}
          </Nav>
          {/* Links at the right */}
          <Nav>
            {!isAuthenticated ? ( // Si NO hay token, se muestra el Login y Register
              <>
                <NavLink to="/login" className={linkClassName}>
                  {t("login")}
                </NavLink>
                <NavLink to="/register" className={linkClassName}>
                  {t("register")}
                </NavLink>
              </>
            ) : (
              // Si hay token, se muestra Profile y Logout
              <>
                {/* Cart Counter always visible when logged in */}
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `${linkClassName({
                      isActive,
                    })} d-flex align-items-center gap-2`
                  }
                >
                  <CartCounter />
                  {t("cart")}
                </NavLink>
                <NavLink to="/user" className={linkClassName}>
                  {t("profile")}
                </NavLink>
                <button onClick={handleLogout} className="btn btn-link nav-link" style={{ padding: 0 }}>
                  {t("logout")}
                </button>
              </>
            )}
            <ThemeToggle />
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}

export default Navbar
