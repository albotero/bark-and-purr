import { Card, Button, ButtonGroup } from "react-bootstrap";

export function ProductCard({ product }) {
  return (
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
          Product Img
        </div>
        <div className="flex-grow-1">
          <h5>{product.title}</h5>
          <small>Unitary Price: ${product.price}</small>
          <div className="mt-2 d-flex align-items-center">
            <ButtonGroup>
              <Button variant="secondary">-</Button>
              <Button variant="light" disabled>
                {product.quantity}
              </Button>
              <Button variant="secondary">+</Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="text-end">
          <h6>Total: ${product.price * product.quantity}</h6>
        </div>
      </Card.Body>
    </Card>
  );
}
