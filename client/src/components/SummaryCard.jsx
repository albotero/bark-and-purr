import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export function SummaryCard({ products }) {
  const subtotal = products.reduce(
    (acc, prod) => acc + prod.price * prod.quantity,
    0
  );

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h5>
          <i className="bi bi-cart"></i> Order Summary
        </h5>
        <hr />
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <h5>Total Amount: ${subtotal.toFixed(2)}</h5>
        <Button variant="primary" className="mt-3" style={{ width: "100%" }}>
          Pay
        </Button>
      </Card.Body>
    </Card>
  );
}
