import { ProductCard } from "./ProductCard";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

const FeaturedProducts = () => {
  // array de prueba
  const featured = [{ id: 1, title: "Producto 1", price: 10, img: "img1.jpg" },
    { id: 2, title: "Producto 2", price: 15, img: "img2.jpg" },
    { id: 3, title: "Producto 3", price: 20, img: "img3.jpg" },
    { id: 4, title: "Producto 4", price: 25, img: "img4.jpg" },
    { id: 5, title: "Producto 5", price: 30, img: "img5.jpg" },
  ];

  return (
    <section className="featured-products my-5">
      <h2 className="text-center mb-4">Featured Products</h2>
      <Row className="d-flex flex-nowrap justify-content-start">
        {featured.length === 0 ? (
          <p className="text-center">Aún no hay productos</p>
        ) : (
          featured.map((product) => (
            <Col key={product.id} style={{ flex: "0 0 20%" }} className="mb-4">
              <ProductCard product={product} showAddToCart={false} />
            </Col>
          ))
        )}
      </Row>
    </section>
  );
};


export default FeaturedProducts;
