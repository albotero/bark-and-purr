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
import Favorites from "./pages/Favorites"
import NewProduct from "./pages/NewProduct"
import Publications from "./pages/Publications"
import EditProduct from "./pages/EditProduct"
import ProtectedRoute from "./components/ProtectedRoute"
import ErrorMsg from "./components/ErrorMsg"
import MyOrders from "./pages/Orders"

function App() {
  return (
    <>
      <Navbar />
      <Container className="container-main">
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="discover" element={<Discover />} />
          <Route path="product/:productId" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="user">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route path="notifications" element={<></>} />
            <Route
              path="purchases"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="publications"
              element={
                <ProtectedRoute>
                  <Publications />
                </ProtectedRoute>
              }
            />
            <Route
              path="new-product"
              element={
                <ProtectedRoute>
                  <NewProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-product/:id"
              element={
                <ProtectedRoute>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<ErrorMsg error="fetch.404" />} />
        </Routes>
      </Container>
      <Footer />
    </>
  )
}

export default App
