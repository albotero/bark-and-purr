import { useCart } from "../context/CartContext";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Cart = () => {
  const { cart, removeFromCart, buyCart, cartTotal } = useCart();

  return (
    <Container className="my-5">
      <h2 className="mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <Row>
          <Col>
            <p className="text-muted">Your cart is empty.</p>
          </Col>
        </Row>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item.id} className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  {/* Product image (placeholder) */}
                  <Col xs="auto">
                    <Container
                      className="d-flex justify-content-center align-items-center bg-light border"
                      style={{ width: "80px", height: "80px" }}
                    >
                      Img
                    </Container>
                  </Col>

                  {/* Product details */}
                  <Col>
                    <h5>{item.title}</h5>
                    <p className="mb-1">
                      ${item.price} × {item.quantity}
                    </p>
                    <p className="mb-0 fw-semibold">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </Col>

                  {/* Remove button */}
                  <Col xs="auto">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {/* Total + Pay button */}
          <Row className="mt-4">
            <Col className="text-end">
              <h4>Total: ${cartTotal.toFixed(2)}</h4>
              <Button variant="success" onClick={buyCart}>
                Pay
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Cart;
