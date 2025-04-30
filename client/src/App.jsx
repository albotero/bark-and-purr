import { Routes, Route } from "react-router"
import Container from "react-bootstrap/esm/Container"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Product from "./pages/Product"
import Cart from "./pages/Cart"
import Footer from "./components/Footer"
import Discover from "./pages/Discover"
import { useUser } from "./context/UserContext"


function App() {
  const { token } = useUser()

  return (
    <>
      <Navbar token={token} />
      <Container className="container-main">
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="discover" element={<Discover />} />
          <Route path="product/:productId" element={<Product />} />
          <Route path="user">
            <Route index element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="favorites" element={<></>} />
            <Route path="notifications" element={<></>} />
            <Route path="purchases" element={<></>} />
            <Route path="publications" element={<></>} />
          </Route>
          <Route path="*" element={<div>Page not found!</div>} />
        </Routes>
      </Container>
      <Footer />
    </>
  )
}

export default App
