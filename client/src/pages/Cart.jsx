import { useCart } from "../hooks/useCart";
import { ProductCard } from "../components/ProductCard";
import { SummaryCard } from "../components/SummaryCard";
import { Container, Row, Col, Spinner } from "react-bootstrap";

export default function CartPage() {
  const userId = 1; // ID fijo por ahora
  const { cart, loading } = useCart(userId);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading Cart...</p>
      </div>
    );
  }

  if (!cart || cart.products.length === 0) {
    return <h3 className="text-center mt-5">No products in cart.</h3>;
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <h4>{cart.products.length} products in your Cart:</h4>
          {cart.products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </Col>
        <Col md={4}>
          <SummaryCard products={cart.products} />
        </Col>
      </Row>
    </Container>
  );
}
