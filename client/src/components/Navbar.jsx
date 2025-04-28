import { Link } from "react-router-dom";
import useUser from "../hooks/UseUser";

const Navbar = () => {
  const { user, logout } = useUser();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      {!user.id ? (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      ) : (
        <>
          <Link to="/notificaciones">Notificaciones</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
