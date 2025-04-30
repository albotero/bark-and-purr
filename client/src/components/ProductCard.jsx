import { Link } from "react-router"
import { BsCart4 } from "react-icons/bs"
import { IoArrowRedo } from "react-icons/io5"
import Button from "react-bootstrap/esm/Button"
import ButtonGroup from "react-bootstrap/esm/ButtonGroup"
import Card from "react-bootstrap/esm/Card"

export function ProductCard({ product }) {
  const { id: productId, title, price, quantity, img } = product

  const isProductInCart = quantity != undefined

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
          {img}
        </div>
        <div className="flex-grow-1">
          <h5>{title}</h5>
          <small>Unitary Price: ${price}</small>
          <div className="mt-2 d-flex align-items-center">
            <ButtonGroup>
              <Button variant="secondary">-</Button>
              <Button variant="light" disabled>
                {quantity}
              </Button>
              <Button variant="secondary">+</Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="text-end">
          <h6>Total: ${price * quantity}</h6>
        </div>
      </Card.Body>
    </Card>
  ) : (
    <Card>
      <Card.Img
        variant="top"
        src={img || "/"}
        className={"ratio ratio-16x9 shadow-sm" + (img ? "" : " bg-secondary")}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="d-flex gap-3 w-100">
          <Card.Text className="flex-grow-1 m-0">${price}</Card.Text>
          <Button variant="outline-primary" size="sm">
            <BsCart4 />
          </Button>
          <Link to={`/product/${productId}`} className="btn btn-outline-primary btn-sm">
            <IoArrowRedo />
          </Link>
        </div>
      </Card.Body>
    </Card>
  )
}
