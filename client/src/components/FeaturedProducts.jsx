import { ProductCard } from "./ProductCard";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const FeaturedProducts = () => {
  // array vacío por ahora
  const featured = [];

  return (
    <section className="featured-products my-5">
      <h2 className="text-center mb-4">Featured Products</h2>
      <Row>
        {featured.length === 0 ? (
          <p className="text-center">Aún no hay productos</p>
        ) : (
          featured.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <ProductCard product={product} showAddToCart={false} />
            </Col>
          ))
        )}
      </Row>
    </section>
  );
};

export default FeaturedProducts;
