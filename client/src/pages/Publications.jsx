import { useEffect, useState } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useUser } from "../context/UserContext";
import { useApi } from "../hooks/useApi";

const Publications = () => {
  const { t } = useTranslation("publications");
  const { getToken } = useUser();
  const [fetchData] = useApi();
  const [publications, setPublications] = useState([]);
  const [loadingStatusId, setLoadingStatusId] = useState(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const { error, publications } = await fetchData({
          method: "GET",
          endpoint: "publications",
          token: getToken(),
        });
        if (error) throw new Error(error);
        setPublications(publications);
      } catch (error) {
        console.error("Error fetching publications:", error);
      }
    };
    fetchPublications();
  }, [getToken, fetchData]);

  const removePublication = async (id) => {
    const result = await Swal.fire({
      title: t("delete_confirm_title"),
      text: t("delete_confirm_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: t("delete_confirm"),
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await fetchData({
        method: "DELETE",
        endpoint: `publications/${id}`,
        token: getToken(),
      });
      if (error) throw new Error(error);
      setPublications((prev) => prev.filter((item) => item.id !== id));
      Swal.fire(t("deleted"), t("delete_success"), "success");
    } catch (error) {
      console.error("Error deleting publication:", error);
      Swal.fire(t("error"), t("delete_error"), "error");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      setLoadingStatusId(id); // ← Bloquea solo ese botón
      const { error, ...updated } = await fetchData({
        method: "PUT",
        endpoint: `publications/${id}/status`,
        token: getToken(),
        body: { is_active: !currentStatus },
      });
      if (error) throw new Error(error);
      setPublications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
      );
    } catch (error) {
      console.error("Error toggling publication:", error);
    } finally {
      setLoadingStatusId(null);
    }
  };

  return (
    <Container className="py-5">
      <h6 className="text-muted mb-3">
        <Link to="/user" className="text-decoration-none">
          Profile
        </Link>{" "}
        &gt; <strong>{t("my.products")}</strong>
      </h6>

      <Card className="border-0 rounded-4 p-4 shadow-sm bg-light-subtle">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col>
              <h3 className="mb-0">{t("title", "Publications")}</h3>
            </Col>
            <Col className="text-end">
              <Link to="/user/new-product">
                <Button variant="primary">{t("new_product")}</Button>
              </Link>
            </Col>
          </Row>

          {!publications?.length ? (
            <Row className="text-center text-muted py-5">
              <p className="fs-5">{t("no_publications")}</p>
            </Row>
          ) : (
            <Row className="g-4">
              {publications.map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    className={`h-100 border rounded-4 p-3 shadow-sm text-dark ${
                      product.is_active_product
                        ? "bg-white"
                        : "bg-secondary-subtle"
                    }`}
                  >
                    <Card.Body className="px-0 pb-0 pt-1">
                      <Row className="justify-content-between align-items-start mb-2">
                        <Col>
                          <Link
                            to={`/product/${product.id}`}
                            className="text-decoration-none text-primary me-5"
                          >
                            <Card.Title as="h5" className="text-dark mb-0">
                              {product.title}
                            </Card.Title>
                          </Link>
                        </Col>
                        <Col xs="auto">
                          {product.is_active_product ? (
                            <Link
                              to={`/user/edit-product/${product.id}`}
                              title="Edit publication"
                              className="text-decoration-none text-danger"
                            >
                              <FaEdit role="button" size={24} className="text-danger" />
                            </Link>
                          ) : (
                            <span className="text-muted" title="Desactivada">
                              <FaEdit
                                size={24}
                                style={{ opacity: 0.4, pointerEvents: "none" }}
                              />
                            </span>
                          )}
                        </Col>
                      </Row>

                      <div
                        className="bg-light d-flex align-items-center justify-content-center mb-3 overflow-hidden rounded"
                        style={{ height: "120px" }}
                      >
                        <Link
                          to={`/product/${product.id}`}
                          className="text-decoration-none text-primary me-5"
                        >
                          {product.images?.length > 0 ? (
                            <Card.Img
                              variant="top"
                              src={product.images[0].url}
                              alt={product.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span className="text-muted">{t("no_image")}</span>
                          )}
                        </Link>
                      </div>

                      <div>
                        <strong>{t("price")}:</strong> $
                        {product.price.toLocaleString()}
                      </div>

                      {product.is_active_product ? (
                        <>
                          <FaStar className="me-1" />
                          {(product.review_count ?? 0) === 1
                            ? "Review"
                            : "Reviews"}{" "}
                          ({product.review_count ?? 0})
                        </>
                      ) : (
                        <span className="text-muted me-5" title="Desactivada">
                          <FaStar className="me-1" />
                          {(product.review_count ?? 0) === 1
                            ? "Review"
                            : "Reviews"}{" "}
                          ({product.review_count ?? 0})
                        </span>
                      )}

                      <Button
                        onClick={() =>
                          toggleStatus(product.id, product.is_active_product)
                        }
                        disabled={loadingStatusId === product.id}
                        className={`position-absolute start-0 bottom-0 m-4 text-white fw-semibold ${
                          product.is_active_product ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {loadingStatusId === product.id
                          ? t("changing")
                          : product.is_active_product
                          ? t("deactivate")
                          : t("activate")}
                      </Button>
                    </Card.Body>

                    <Card.Footer className="bg-transparent border-0 text-end">
                      {product.is_active_product ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removePublication(product.id)}
                          title={t("delete_confirm_button")}
                        >
                          <FaTrash />
                        </Button>
                      ) : (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled
                          title={t("deactivate_product_protection")}
                        >
                          <FaTrash style={{ opacity: 0.4 }} />
                        </Button>
                      )}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Publications;
