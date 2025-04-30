import { useState } from "react";
import { useCart } from "../context/CartContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export function ProductCard({ product, onAddToCart, isInCart }) {
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const { decreaseQuantity } = useCart();

  const increase = () => {
    if (isInCart && onAddToCart) {
      onAddToCart({ ...product, quantity: 1 });
    } else {
      setQuantity((q) => q + 1);
    }
  };

  const decrease = () => {
    if (isInCart) {
      decreaseQuantity(product.id);
    } else if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Container>
          <Row className="align-items-center">
            <Col xs="auto">
              <Container
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#d3d3d3",
                }}
              >
                Product Image
              </Container>
            </Col>

            <Col>
              <h5>{product.title}</h5>
              <small>Unit Price: ${product.price}</small>
              <Row className="mt-2">
                <Col xs="auto">
                  <ButtonGroup>
                    <Button variant="secondary" onClick={decrease}>
                      -
                    </Button>
                    <Button variant="light" disabled>
                      {isInCart ? product.quantity : quantity}
                    </Button>
                    <Button variant="secondary" onClick={increase}>
                      +
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Col>

            <Col xs="auto" className="text-end">
              <h6>
                Total: $
                {product.price * (isInCart ? product.quantity : quantity)}
              </h6>
            </Col>
          </Row>

          {!isInCart && (
            <Row className="mt-3">
              <Col className="text-end">
                <Button
                  variant="outline-primary"
                  onClick={() => onAddToCart({ ...product, quantity })}
                >
                  <i className="bi bi-cart-plus"></i> Add to Cart
                </Button>
              </Col>
            </Row>
          )}
        </Container>
      </Card.Body>
    </Card>
  );
}
