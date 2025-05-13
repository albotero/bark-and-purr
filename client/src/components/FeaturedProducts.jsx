import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import { ProductCard } from "./ProductCard";
import { useApi } from "../hooks/useApi";
import Loading from "./Loading";
import ErrorMsg from "./ErrorMsg";
import { Link } from "react-router-dom";
import "../styles/FeaturedProducts.css";

const FeaturedProducts = () => {
  const { t } = useTranslation("home");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchProducts] = useApi();

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      const response = await fetchProducts({
        endpoint: "products",
        query: {
          results_per_page: 7,
          order_by: "random",
        },
      });

      if (response?.error) {
        setError(response.error);
      } else {
        setProducts(response.results || []);
      }

      setIsLoading(false);
    };

    fetchFeatured();
  }, [fetchProducts]);

  return (
    <section className="featured-products my-5">
      <h2 className="text-center mb-4">{t("featured.title")}</h2>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorMsg error={error} />
      ) : products.length === 0 ? (
        <p className="text-center">{t("featured.no_products")}</p>
      ) : (
        <>
          {/* Productos en contenedor con scroll */}
          <Row className="scroll-container d-flex flex-nowrap overflow-auto px-3">
            {products.map((product) => (
              <Col
                key={product.id}
                style={{ flex: "0 0 20%" }}
                className="mb-4 fade-in-up"
              >
                <ProductCard product={product} showAddToCart={false} />
              </Col>
            ))}
          </Row>

          {/* boton para ver más*/}
          <Row className="justify-content-center mt-4">
            <Col xs="auto">
              <Link to="/discover" className="btn btn-outline-secondary btn-sm">
                {t("featured.view_all")}
              </Link>
            </Col>
          </Row>
        </>
      )}
    </section>
  );
};

export default FeaturedProducts;
