import { Link } from "react-router-dom"
import { BsCart4, BsTrash } from "react-icons/bs" // 🆕 BsTrash importado
import { IoArrowRedo } from "react-icons/io5"
import Button from "react-bootstrap/esm/Button"
import ButtonGroup from "react-bootstrap/esm/ButtonGroup"
import Card from "react-bootstrap/esm/Card"
import { useCart } from "../context/CartContext"

export function ProductCard({ product, showAddToCart = true }) {
  // Prop showAddToCart agregado
  const { id: productId, title, price, thumbnail } = product
  const { addToCart, removeFromCart, decreaseQuantity, cart } = useCart()

  const cartItem = cart.find((item) => item.id === productId)
  const isProductInCart = !!cartItem

  return isProductInCart ? (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="d-flex align-items-center">
        <div
          className="me-3"
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#d3d3d3",
          }}
        >
          {thumbnail}
        </div>
        <div className="flex-grow-1">
          <h5>{title}</h5>
          <small>Unitary Price: ${price}</small>
          <div className="mt-2 d-flex align-items-center gap-2">
            <ButtonGroup>
              <Button variant="secondary" onClick={() => decreaseQuantity(productId)}>
                -
              </Button>
              <Button variant="light" disabled>
                {cartItem.quantity}
              </Button>
              <Button variant="secondary" onClick={() => addToCart({ ...product, quantity: 1 })}>
                +
              </Button>
            </ButtonGroup>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeFromCart(productId)}
              title="Remove from cart"
            >
              <BsTrash />
            </Button>
          </div>
        </div>
        <div className="text-end">
          <h6>Total: ${price * cartItem.quantity}</h6>
        </div>
      </Card.Body>
    </Card>
  ) : (
    <Card>
      <Card.Img
        variant="top"
        src={thumbnail || "/"}
        className={"ratio ratio-16x9 shadow-sm" + (thumbnail ? "" : " bg-secondary")}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="d-flex gap-3 w-100">
          <Card.Text className="flex-grow-1 m-0">${price}</Card.Text>

          {/* Solo renderizar el botón si showAddToCart es true */}
          {showAddToCart && (
            <Button variant="outline-primary" size="sm" onClick={() => addToCart({ ...product, quantity: 1 })}>
              <BsCart4 />
            </Button>
          )}

          <Link to={`/product/${productId}`} className="btn btn-outline-primary btn-sm">
            <IoArrowRedo />
          </Link>
        </div>
      </Card.Body>
    </Card>
  )
}
