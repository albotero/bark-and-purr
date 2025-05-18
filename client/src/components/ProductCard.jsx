import "../styles/ProductCard.css"
import { Link } from "react-router-dom"
import { BsCart4, BsTrash } from "react-icons/bs"
import { IoArrowRedo } from "react-icons/io5"
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
  const isProductInCart = !!cartItem

  return isProductInCart ? (
    <Card className="mb-3 shadow-sm position-relative">
      <FavHeart product={product} />

      <div className="position-relative">
        <Card.Img
          variant="top"
          src={thumbnail || "/placeholder.png"}
          alt={title.content}
          className={"ratio ratio-16x9 shadow-sm" + (thumbnail ? "" : " bg-secondary")}
        />
        {rating && (
          <div className="product-rating">
            <TiStarFullOutline className="star" /> {Number(rating).toFixed(1)}
          </div>
        )}
      </div>

      <Card.Body className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h5>{title.content}</h5>
          <div className="d-flex justify-content-between fs-6 flex-wrap">
            <p className="m-0">${price.toLocaleString()}/u</p>
            <p className="m-0">Total: ${(price * cartItem.quantity).toLocaleString()}</p>
          </div>
          <div className="mt-2 d-flex align-items-center gap-2">
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
    <Card className="position-relative">
      <FavHeart product={product} />

      <div className="position-relative">
        <Card.Img
          variant="top"
          src={thumbnail || "/placeholder.png"}
          alt={title.content}
          className={"ratio ratio-16x9 shadow-sm" + (thumbnail ? "" : " bg-secondary")}
        />
        {rating && (
          <div className="product-rating">
            <TiStarFullOutline className="star" /> {Number(rating).toFixed(1)}
          </div>
        )}
      </div>

      <Card.Body>
        <Card.Title>{title.content}</Card.Title>
        <div className="d-flex gap-3 w-100">
          <Card.Text className="flex-grow-1 m-0">${price.toLocaleString()}</Card.Text>

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
