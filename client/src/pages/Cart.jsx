import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Cart = () => {
  const { cart, removeFromCart, buyCart, cartTotal, increaseQty, decreaseQty } =
    useCart();

  return (
    <Container className="my-5">
      <p>
        <Link to="/" className="text-decoration-none text-muted">
          Home
        </Link>{" "}
        &gt; <b>Cart</b>
      </p>
      <h5 className="mb-4">{cart.length} products in your Cart:</h5>

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
                    {/* Product image */}
                    <Col xs={3} className="text-center">
                      <div
                        className="bg-light border rounded d-flex justify-content-center align-items-center"
                        style={{ height: "80px" }}
                      >
                        Product Img
                      </div>
                    </Col>

                    {/* Product details */}
                    <Col xs={6}>
                      <h5 className="mb-1">{item.title}</h5>
                      <p className="mb-1 text-muted">
                        Unitary Price: ${item.price}
                      </p>

                      {/* Quantity controls */}
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

                    {/* Total */}
                    <Col xs={3} className="text-end">
                      <p className="fw-semibold mb-0">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
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
                <h5 className="mb-3">
                  🛒 <strong>Summary</strong>
                </h5>
                <p>Subtotal</p>
                <h5 className="fw-bold mb-4">
                  Total Amount: ${cartTotal.toFixed(2)}
                </h5>
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