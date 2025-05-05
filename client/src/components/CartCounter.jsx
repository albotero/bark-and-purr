import { useCart } from "../context/CartContext"
import { Badge } from "react-bootstrap"
import { Link } from "react-router-dom"

export function CartCounter() {
  const { cart } = useCart()
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  // If there are no items, don't render anything
  if (totalItems === 0) return null

  return (
    <Link to="/cart" className="text-decoration-none text-light">
      <i className="bi bi-cart"></i>
      <Badge bg="light" text="dark" className="ms-1">
        {totalItems}
      </Badge>
    </Link>
  )
}
