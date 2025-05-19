import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Spinner from "react-bootstrap/Spinner"
import { FiUploadCloud } from "react-icons/fi"
import Swal from "sweetalert2"
import { useUser } from "../context/UserContext"
import { useApi } from "../hooks/useApi"

const NewProduct = () => {
  const { getToken } = useUser()
  const [fetchData] = useApi()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    images: [],
  })
  const [isPublishing, setIsPublishing] = useState(false)
  const [previewUrls, setPreviewUrls] = useState([])

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "images") {
      const filesArray = files ? Array.from(files) : []
      setFormData((prev) => ({
        ...prev,
        images: filesArray,
      }))

      const previews = filesArray.map((file) => URL.createObjectURL(file))
      setPreviewUrls(previews)
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to publish this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6f42c1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, publish it!",
    })

    if (!confirm.isConfirmed) return

    setIsPublishing(true)

    const { title, description, price, stock, images } = formData
    const formDataToSend = new FormData()
    formDataToSend.append("title", title)
    formDataToSend.append("description", description)
    formDataToSend.append("price", price)
    formDataToSend.append("stock", stock)

    if (images && images.length > 0) {
      images.forEach((image) => formDataToSend.append("images", image))
    }

    try {
      const { error } = await fetchData({
        method: "POST",
        endpoint: "publications",
        token: getToken(),
        body: formDataToSend,
        sendContentType: false,
      })
      if (error) throw new Error(error)
      await Swal.fire({
        icon: "success",
        title: "Published!",
        text: "Your product has been published.",
        confirmButtonColor: "#6f42c1",
      })
      navigate("/user/publications")
    } catch (error) {
      console.error("Error creating publication:", error)
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <Container className="my-4">
      <span className="text-muted">
        <Link to="/user" className="text-decoration-none">
          Profile
        </Link>{" "}
        &gt;{" "}
        <Link to="/user/publications" className="text-decoration-none">
          My publications
        </Link>{" "}
        &gt; <strong>New product</strong>
      </span>

      <Card className="p-4 mt-3">
        <Form onSubmit={handleSubmit} className="position-relative">
          {isPublishing && (
            <Spinner
              animation="border"
              variant="primary"
              className="position-absolute top-50 start-50 translate-middle z-3"
            />
          )}
          <fieldset disabled={isPublishing}>
            <Row className="mb-3">
              <Col md={6}>
                <h5 className="fw-bold mb-3">Basic information</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Product Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="form-control-lg w-100"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="form-control-lg w-100"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <h5 className="fw-bold mb-3">Price and Stock</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min={0}
                    className="form-control-lg w-100"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min={0}
                    className="form-control-lg w-100"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="fw-bold mt-4">Images</h5>
            <Form.Group
              className="mb-4 border-2 p-5 text-center bg-light"
              style={{
                borderStyle: "dashed",
                cursor: "pointer",
              }}
            >
              <Form.Label htmlFor="image-upload" className="d-block">
                {previewUrls.length === 0 ? (
                  <>
                    <FiUploadCloud size={48} className="text-secondary mb-2" />
                    <span className="d-block text-secondary">Upload Images</span>
                  </>
                ) : (
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    {previewUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`preview-${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ))}
                  </div>
                )}
              </Form.Label>
              <Form.Control
                type="file"
                name="images"
                id="image-upload"
                onChange={handleChange}
                accept="image/*"
                multiple
                className="d-none"
              />
            </Form.Group>

            <Row className="justify-content-end">
              <Col xs="auto">
                <Button variant="outline-secondary" onClick={() => navigate("/user/publications")}>
                  Cancel
                </Button>
              </Col>
              <Col xs="auto">
                <Button
                  type="submit"
                  style={{
                    backgroundColor: "#6f42c1",
                    borderColor: "#6f42c1",
                  }}
                >
                  Publish
                </Button>
              </Col>
            </Row>
          </fieldset>
        </Form>
      </Card>
    </Container>
  )
}

export default NewProduct
