import "../styles/Navbar.css"
import { NavLink, Link } from "react-router-dom"
import Container from "react-bootstrap/esm/Container"
import Nav from "react-bootstrap/esm/Nav"
import BsNavbar from "react-bootstrap/esm/Navbar"
import { useUser } from "../context/UserContext"
import { CartCounter } from "../components/CartCounter"

const Navbar = () => {
  const { token, logout } = useUser()

  const handleLogout = () => {
    logout()
  }

  const linkClassName = ({ isActive }) => "nav-link" + (isActive ? " active" : "")

  return (
    <BsNavbar expand="lg" variant="dark" className="bg-primary">
      <Container>
        <BsNavbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          <img
            src="/logo.png"
            alt="Logo"
            width="60"
            height="60"
          />
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BsNavbar.Collapse>
          {/* Links at the left */}
          <Nav className="me-auto">
            <NavLink to="/" className={linkClassName}>
              Home
            </NavLink>
            <NavLink to="/discover" className={linkClassName}>
              Discover
            </NavLink>
            <NavLink to="/product/p123" className={linkClassName}>
              Product
            </NavLink>
          </Nav>
          {/* Links at the right */}
          <Nav>
            {!token ? ( // Si NO hay token, se muestra el Login y Register
              <>
                <NavLink to="/login" className={linkClassName}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClassName}>
                  Register
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
                  Profile
                </NavLink>
                <NavLink to="/user/cart" className={linkClassName}>
                  Cart
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="btn btn-link nav-link"
                  style={{ padding: 0 }}
                >
                  Logout
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
  );
}

export default Navbar
