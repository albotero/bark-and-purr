import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

const Cart = () => {
  const { cart, removeFromCart, buyCart, cartTotal, increaseQty, decreaseQty } =
    useCart();

  const [shippingMethod, setShippingMethod] = useState("pickup");
  const shippingCost = shippingMethod === "delivery" ? 2000 : 0;
  const totalWithShipping = cartTotal + shippingCost;

  return (
    <Container className="my-5">
      <p>
        <Link to="/" className="text-decoration-none text-muted">
          Home
        </Link>{" "}
        &gt; <strong>Cart</strong>
      </p>

      <Card.Title as="h5" className="mb-4">
        {cart.length} products in your Cart:
      </Card.Title>

      {cart.length === 0 ? (
        <Row>
          <Col>
            <p className="text-muted">Your cart is empty.</p>
          </Col>
        </Row>
      ) : (
        <Row>
          {/* Left side: Cart Items */}
          <Col md={8}>
            {cart.map((item) => (
              <Card key={item.id} className="mb-3 shadow-sm rounded-4">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={3} className="text-center">
                      <div
                        className="bg-light border rounded d-flex justify-content-center align-items-center"
                        style={{ height: "80px" }}
                      >
                        Product Img
                      </div>
                    </Col>

                    <Col xs={6}>
                      <Card.Title as="h6">{item.title}</Card.Title>
                      <Card.Text className="text-muted">
                        Unitary Price: ${item.price}
                      </Card.Text>

                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => decreaseQty(item.id)}
                        >
                          -
                        </Button>
                        <span className="fw-bold">{item.quantity}</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => increaseQty(item.id)}
                        >
                          +
                        </Button>
                      </div>
                    </Col>

                    <Col xs={3} className="text-end">
                      <Card.Text className="fw-semibold mb-1">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </Card.Text>
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
          </Col>

          {/* Right side: Summary */}
          <Col md={4}>
            <Card className="shadow-sm rounded-4">
              <Card.Body>
                <Card.Title as="h5" className="mb-3">
                  🛒 <strong>Summary</strong>
                </Card.Title>

                <ListGroup className="mb-3">
                  <ListGroup.Item>
                    Subtotal: ${cartTotal.toFixed(2)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Card.Subtitle className="mb-2 fw-bold">
                      shipping
                    </Card.Subtitle>
                    <Form.Check
                      type="radio"
                      name="shipping"
                      label="store pick up (free) - Av. Siempre Viva 123"
                      checked={shippingMethod === "pickup"}
                      onChange={() => setShippingMethod("pickup")}
                    />
                    <Form.Check
                      type="radio"
                      name="shipping"
                      label="price fixed: $2000"
                      checked={shippingMethod === "delivery"}
                      onChange={() => setShippingMethod("delivery")}
                      className="mt-2"
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Total: ${totalWithShipping.toFixed(2)}
                  </ListGroup.Item>
                </ListGroup>

                <Button
                  variant="primary"
                  className="w-100 rounded-pill"
                  onClick={buyCart}
                >
                  Pay
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
