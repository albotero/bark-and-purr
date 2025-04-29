//import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  //array vacío por ahora
  const featured = [];

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="product-carousel">
        {featured.length === 0 ? (
          <p>No featured products yet 🐾</p>
        ) : (
          featured.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>{product.price}</p>
              <p>
                <strong>Stock: </strong>
                {product.stock}
              </p>
              <a href="/products">See more</a>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
export default FeaturedProducts;
