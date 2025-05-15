import { useState } from "react";
import { useCart } from "../context/CartContext";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Tree from "../components/Tree";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const Cart = () => {
  const { cart, removeFromCart, buyCart, increaseQty, decreaseQty } = useCart();
  const { t } = useTranslation("cart");

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const treeItems = [
    { key: "home", href: "/" },
    { key: "cart", isActive: true },
  ];

  const [shippingMethod, setShippingMethod] = useState("pickup");
  const shippingCost = shippingMethod === "delivery" ? 3000 : 0;
  const totalWithShipping = cartTotal + shippingCost;

  const handleBuy = async () => {
    try {
      await buyCart();

      Swal.fire({
        icon: "success",
        title: t("success_title", "Purchase completed!"),
        text: t("success_message", "Thank you for your purchase."),
        confirmButtonColor: "#3085d6",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: t("error_title", "Oops..."),
        text: t("error_message", "Something went wrong."),
      });
    }
  };

  return (
    <Container className="section-padding">
      <Tree items={treeItems} />

      <h5 className="mb-4">{t("title", { count: cart.length })}:</h5>

      {cart.length === 0 ? (
        <Row>
          <Col>
            <p className="text-muted">{t("empty")}.</p>
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
                        <img
                          src={item.thumbnailLowRes || "/placeholder.png"}
                          data-src={item.thumbnail || "/placeholder.png"}
                          alt={item.title}
                          className="img-fluid rounded"
                          style={{ maxHeight: "80px", objectFit: "cover" }}
                          loading="lazy"
                        />
                      </div>
                    </Col>

                    <Col xs={6}>
                      <h5 className="mb-1">{item.title}</h5>
                      <p className="mb-1 text-muted">
                        {t("unit_price")}: ${item.price}
                      </p>

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
                      <p className="fw-semibold mb-0">
                        {t("total")}: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        {t("remove")}
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
                  🛒 <strong>{t("summary")}</strong>
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
                      label="price fixed: $3"
                      checked={shippingMethod === "delivery"}
                      onChange={() => setShippingMethod("delivery")}
                      className="mt-2"
                    />
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {t("total_amount")}: ${totalWithShipping.toFixed(2)}
                  </ListGroup.Item>
                </ListGroup>

                <Button
                  variant="primary"
                  className="w-100 rounded-pill"
                  onClick={handleBuy}
                >
                  {t("pay")}
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
