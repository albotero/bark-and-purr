import { useCart } from "../context/CartContext";
import { Badge } from "react-bootstrap";

export function CartCounter() {
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <>
      <i className="bi bi-cart"></i>
      <Badge bg="light" text="dark" className="ms-1">
        {totalItems}
      </Badge>
    </>
  );
}
