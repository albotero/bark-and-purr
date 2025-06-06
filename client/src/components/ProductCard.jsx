import "../styles/ProductCard.css"
import { Link } from "react-router-dom"
import { BsCart4, BsTrash } from "react-icons/bs"
import { TiStarFullOutline } from "react-icons/ti"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Card from "react-bootstrap/Card"
import FavHeart from "./FavHeart"
import { useCart } from "../context/CartContext"

export function ProductCard({ product, showAddToCart = true }) {
  const { id: productId, title, price, thumbnail, rating } = product
  const { addToCart, removeFromCart, decreaseQty, increaseQty, getCartItem } = useCart()

  const cartItem = getCartItem(productId)

  return cartItem ? (
    /* Product is already in cart */
    <Card className="mb-3 shadow-sm position-relative">
      <FavHeart product={product} />

      <Link to={`/product/${productId}`} className="position-relative">
        <Card.Img
          variant="top"
          src={thumbnail || "/placeholder.png"}
          alt={title.content}
          className={"ratio ratio-16x9 shadow-sm" + (thumbnail ? "" : " bg-secondary")}
        />
        {rating && (
          <div className="product-rating">
            <TiStarFullOutline className="star" /> {rating.toFixed(1)}
          </div>
        )}
      </Link>

      <Card.Body className="d-flex align-items-center">
        <div className="flex-grow-1">
          <Link to={`/product/${productId}`} className="text-decoration-none">
            <Card.Title>{title.content}</Card.Title>
          </Link>
          <div className="d-flex justify-content-between fs-6 flex-wrap">
            <p className="m-0">${price.toLocaleString()}/u</p>
            <p className="m-0">Total: ${(price * cartItem.quantity).toLocaleString()}</p>
          </div>
          <div className="mt-2 d-flex align-items-center justify-content-center gap-2">
            <ButtonGroup>
              <Button variant="secondary" onClick={() => decreaseQty(productId)}>
                -
              </Button>
              <Button variant="light" disabled>
                {cartItem.quantity}
              </Button>
              <Button variant="secondary" onClick={() => increaseQty(productId)}>
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
      </Card.Body>
    </Card>
  ) : (
    /* Product is not in cart */
    <Card className="position-relative">
      <FavHeart product={product} />

      <Link to={`/product/${productId}`} className="position-relative">
        <Card.Img
          variant="top"
          src={thumbnail || "/placeholder.png"}
          alt={title.content}
          className={"ratio ratio-16x9 shadow-sm" + (thumbnail ? "" : " bg-secondary")}
        />
        {rating && (
          <div className="product-rating">
            <TiStarFullOutline className="star" /> {rating.toFixed(1)}
          </div>
        )}
      </Link>

      <Card.Body>
        <Link to={`/product/${productId}`} className="text-decoration-none">
          <Card.Title>{title.content}</Card.Title>
        </Link>
        <div className="d-flex gap-3 w-100">
          <Card.Text className="flex-grow-1 m-0">${price.toLocaleString()}</Card.Text>

          {showAddToCart && (
            <Button variant="outline-primary" size="sm" onClick={() => addToCart({ ...product, quantity: 1 })}>
              <BsCart4 />
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
