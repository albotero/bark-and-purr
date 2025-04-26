import { Routes, Route } from "react-router"
import Container from "react-bootstrap/esm/Container"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Product from "./pages/Product"

function App() {
  return (
    <>
      <Navbar />
      <Container className="container-main">
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<></>} />
          <Route path="search" element={<></>} />
          <Route path="product/:productId" element={<Product />} />
          <Route path="user">
            <Route index element={<Profile />} />
            <Route path="cart" element={<></>} />
            <Route path="favorites" element={<></>} />
            <Route path="notifications" element={<></>} />
            <Route path="purchases" element={<></>} />
            <Route path="publications" element={<></>} />
          </Route>
          <Route path="*" element={<div>Page not found!</div>} />
        </Routes>
      </Container>
    </>
  )
}

export default App
