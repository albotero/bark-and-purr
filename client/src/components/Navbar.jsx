import "../styles/Navbar.css"
import { NavLink, Link } from "react-router-dom"
import Container from "react-bootstrap/esm/Container"
import Nav from "react-bootstrap/esm/Nav"
import BsNavbar from "react-bootstrap/esm/Navbar"
import { useUser } from "../context/UserContext"
import { CartCounter } from "../components/CartCounter"
import { useTranslation } from "react-i18next"

const Navbar = () => {
  const { token, logout } = useUser()
  const { t } = useTranslation("navbar")

  const handleLogout = () => {
    logout()
  }

  const linkClassName = ({ isActive }) => "nav-link" + (isActive ? " active" : "")

  return (
    <BsNavbar expand="lg" variant="dark" className="bg-primary">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          B & P
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
            <NavLink to="/product/p123" className={linkClassName}>
              ***product
            </NavLink>
          </Nav>
          {/* Links at the right */}
          <Nav>
            {!token ? ( // Si NO hay token, se muestra el Login y Register
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
                <Nav.Item className="me-3">
                  <CartCounter />
                </Nav.Item>
                <NavLink to="/user" className={linkClassName}>
                  {t("profile")}
                </NavLink>
                <NavLink to="/user/cart" className={linkClassName}>
                  {t("cart")}
                </NavLink>
                <button onClick={handleLogout} className="btn btn-link nav-link" style={{ padding: 0 }}>
                  {t("logout")}
                </button>
                {/* <NavLink to="/logout" className="nav-link">
                  Logout
                </NavLink> */}
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}

export default Navbar
