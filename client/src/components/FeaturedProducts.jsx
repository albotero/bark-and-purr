import { ProductCard } from "./ProductCard";

const FeaturedProducts = () => {
  // array vacío por ahora
  const featured = [];

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="product-carousel">
        {featured.length === 0 ? (
          <p>aún no hay productos</p>
        ) : (
          featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
