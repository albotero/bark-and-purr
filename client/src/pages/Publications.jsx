import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import { ProductCard } from "../components/ProductCard";
import { Link } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa6";

const Publications = () => {
  const { t } = useTranslation("publications");
  const [publications, setPublications] = useState([]);

  const userId = 1;

  useEffect(() => {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];

    const userProducts = allProducts.filter(
      (product) => product.ownerId === userId
    );

    setPublications(userProducts);
  }, []);

  const removePublication = (id) => {
    const updatedPublications = publications.filter((item) => item.id !== id);
    setPublications(updatedPublications);

    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    const updatedProducts = allProducts.filter((item) => item.id !== id);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  return (
    <>
      <Container className="py-5">
        <h6 className="text-muted mb-3">
          <Link to="/user" className="text-decoration-none">
            Profile
          </Link>{" "}
          &gt; <strong>My publications</strong>
        </h6>

        <h2 className="mb-4">
          {t("title", "Publications")} ({publications.length})
        </h2>

        {publications.length === 0 ? (
          <div className="text-center">
            <FaBoxOpen size={48} className="text-secondary mb-2" />
            <p>
              {t("emptyMessage", "You haven't published any products yet.")}
            </p>
          </div>
        ) : (
          <Row className="g-4">
            {publications.map((product) => (
              <Col key={product.id} sm={12} md={6} lg={4}>
                <div className="position-relative">
                  <ProductCard product={product} showAddToCart={false} />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-2"
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        "Are you sure you want to delete this publication?"
                      );
                      if (confirmDelete) {
                        removePublication(product.id);
                      }
                    }}
                    title="Delete publication"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Botón flotante siempre visible */}
      <Link
        to="/user/new-product"
        className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4 d-flex align-items-center justify-content-center shadow"
        style={{
          width: "60px",
          height: "60px",
          fontSize: "24px",
          zIndex: 1050,
        }}
        title="Add new product"
      >
        <FaFileCirclePlus />
      </Link>
    </>
  );
};

export default Publications;
