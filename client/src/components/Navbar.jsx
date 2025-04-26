import "../styles/Navbar.css"
import { NavLink } from "react-router"
import Container from "react-bootstrap/esm/Container"
import Nav from "react-bootstrap/esm/Nav"
import BsNavbar from "react-bootstrap/esm/Navbar"

const Navbar = () => {
  const linkClassName = ({ isActive }) => "nav-link" + (isActive ? " active" : "")

  return (
    <BsNavbar expand="lg" variant="dark" className="bg-primary">
      <Container>
        <BsNavbar.Brand href="/">B & P</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BsNavbar.Collapse>
          {/* Links at the left */}
          <Nav className="me-auto">
            <NavLink to="/" className={linkClassName}>
              Home
            </NavLink>
            <NavLink to="/product/p123" className={linkClassName}>
              Product
            </NavLink>
          </Nav>
          {/* Links at the right */}
          <Nav>
            <NavLink to="/user" className={linkClassName}>
              Profile
            </NavLink>
            <NavLink to="/logout" className="nav-link">
              Logout
            </NavLink>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}

export default Navbar
