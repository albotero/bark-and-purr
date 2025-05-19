import { useCart } from "../context/CartContext"
import { Badge } from "react-bootstrap"

export function CartCounter() {
  const { cart } = useCart()
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    totalItems > 0 && (
      <>
        <i className="bi bi-cart"></i>
        <Badge bg="light" text="dark">
          {totalItems}
        </Badge>
      </>
    )
  )
}
