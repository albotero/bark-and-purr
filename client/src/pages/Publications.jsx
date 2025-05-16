import { useEffect, useState } from "react"
import { Container, Button, Row, Col, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaEdit, FaTrash, FaStar } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"

const Publications = () => {
  const { t } = useTranslation("publications")
  const [publications, setPublications] = useState([])
  const [loadingStatusId, setLoadingStatusId] = useState(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/publications", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch publications")

        const data = await response.json()
        setPublications(data)
      } catch (error) {
        console.error("Error fetching publications:", error)
      }
    }

    fetchPublications()
  }, [token])

  const removePublication = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    })

    if (!result.isConfirmed) return

    try {
      const response = await fetch(`http://localhost:3000/api/publications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete publication")

      setPublications((prev) => prev.filter((item) => item.id !== id))

      Swal.fire("Deleted!", "Your publication has been removed.", "success")
    } catch (error) {
      console.error("Error deleting publication:", error)
      Swal.fire("Error", "Failed to delete publication", "error")
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      setLoadingStatusId(id) // ← Bloquea solo ese botón
      const response = await fetch(`http://localhost:3000/api/publications/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (!response.ok) throw new Error("Failed to toggle publication")

      const updated = await response.json()

      setPublications((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)))
    } catch (error) {
      console.error("Error toggling publication:", error)
    } finally {
      setLoadingStatusId(null)
    }
  }

  return (
    <Container className="py-5">
      <h6 className="text-muted mb-3">
        <Link to="/user" className="text-decoration-none">
          Profile
        </Link>{" "}
        &gt; <strong>My Products</strong>
      </h6>

      <Card className="border-0 rounded-4 p-4 shadow-sm bg-light-subtle">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col>
              <h3 className="mb-0">{t("title", "Publications")}</h3>
            </Col>
            <Col className="text-end">
              <Link to="/user/new-product">
                <Button variant="primary">New product</Button>
              </Link>
            </Col>
          </Row>

          {publications.length === 0 ? (
            <Row className="text-center text-muted py-5">
              <p className="fs-5">You haven't published any products yet.</p>
            </Row>
          ) : (
            <Row className="g-4">
              {publications.map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    className={`h-100 border rounded-4 p-3 shadow-sm ${
                      product.is_active_product ? "bg-white" : "bg-secondary-subtle"
                    }`}
                  >
                    <Card.Body>
                      <Row className="justify-content-between align-items-start mb-2">
                        <Col>
                          <Card.Title as="h5" className="mb-0">
                            {product.title}
                          </Card.Title>
                        </Col>
                        <Col xs="auto">
                          {product.is_active_product ? (
                            <Link
                              to={`/user/edit-product/${product.id}`}
                              title="Edit publication"
                              className="text-decoration-none text-dark"
                            >
                              <FaEdit role="button" size={24} />
                            </Link>
                          ) : (
                            <span className="text-muted" title="Desactivada">
                              <FaEdit size={24} style={{ opacity: 0.4, pointerEvents: "none" }} />
                            </span>
                          )}
                        </Col>
                      </Row>

                      <div
                        className="bg-light d-flex align-items-center justify-content-center mb-2 overflow-hidden rounded"
                        style={{ height: "120px" }}
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
                          <span className="text-muted">No image</span>
                        )}
                      </div>

                      <div className="mb-2">
                        <strong>Price:</strong> ${product.price}
                      </div>

                      {product.is_active_product ? (
                        <Link to={`/product/${product.id}`} className="text-decoration-none text-primary me-5">
                          <FaStar className="me-1" />
                          {(product.review_count ?? 0) === 1 ? "Review" : "Reviews"} ({product.review_count ?? 0})
                        </Link>
                      ) : (
                        <span className="text-muted me-5" title="Desactivada">
                          <FaStar className="me-1" />
                          {(product.review_count ?? 0) === 1 ? "Review" : "Reviews"} ({product.review_count ?? 0})
                        </span>
                      )}

                      <Button
                        onClick={() => toggleStatus(product.id, product.is_active_product)}
                        disabled={loadingStatusId === product.id}
                        className={`position-absolute start-0 bottom-0 m-4 text-white fw-semibold ${
                          product.is_active_product ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {loadingStatusId === product.id
                          ? "Cambiando..."
                          : product.is_active_product
                          ? "Desactivar"
                          : "Activar"}
                      </Button>
                    </Card.Body>

                    <Card.Footer className="bg-transparent border-0 text-end">
                      {product.is_active_product ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removePublication(product.id)}
                          title="Delete publication"
                        >
                          <FaTrash />
                        </Button>
                      ) : (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled
                          title="Desactiva el producto para protegerlo"
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
  )
}

export default Publications
