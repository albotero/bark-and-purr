import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Swal from "sweetalert2"
import { useUser } from "../context/UserContext"
import { useApi } from "../hooks/useApi"

const EditProduct = () => {
  const { id: productId } = useParams()
  const { getToken } = useUser()
  const [fetchData] = useApi()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
  })
  const [existingImages, setExistingImages] = useState([])
  const [imagesToDelete, setImagesToDelete] = useState([])
  const [newImages, setNewImages] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { error, images, ...product } = await fetchData({
          method: "GET",
          endpoint: `publications/${productId}`,
          token: getToken(),
        })
        if (error) throw new Error(error)
        setFormData(product)
        setExistingImages(images || [])
      } catch (err) {
        console.error("Error fetching product:", err)
      }
    }
    fetchProduct()
  }, [productId, getToken, fetchData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageDelete = async (publicId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this image?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    })

    if (!result.isConfirmed) return

    setImagesToDelete((prev) => [...prev, publicId])
    setExistingImages((prev) => prev.filter((img) => img.key !== publicId))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save",
      cancelButtonText: "Cancel",
    })

    if (!result.isConfirmed) return

    const formDataToSend = new FormData()
    formDataToSend.append("title", formData.title)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("price", formData.price)
    formDataToSend.append("stock", formData.stock)
    formDataToSend.append("imagesToDelete", JSON.stringify(imagesToDelete))

    newImages.forEach((file) => {
      formDataToSend.append("files", file)
    })

    try {
      const { error } = await fetchData({
        method: "PUT",
        endpoint: `publications/${productId}`,
        body: formDataToSend,
        token: getToken(),
      })
      if (error) throw new Error(error)
      Swal.fire("Success!", "The post has been updated.", "success")
      navigate("/user/publications")
    } catch (error) {
      console.error("Error updating publication:", error)
      Swal.fire("Error", "There was an error updating the post.", "error")
    }
  }

  return (
    <Container className="my-4">
      <Card className="p-4">
        <h2>Edit Product</h2>
        <Form onSubmit={handleEditSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fs-4">Title</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fs-4">Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="fs-4">Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min={0}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="fs-4">Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min={0}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <h5 className="text-primary mb-3">Existing Images</h5>
              <Row>
                {existingImages.map((img) => (
                  <Col key={img.key} xs={6} className="mb-3 text-center">
                    <img
                      src={img.url}
                      alt="Product"
                      className="img-thumbnail rounded"
                      style={{
                        height: "150px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                    />
                    <div className="mt-2">
                      <Button
                        variant="danger"
                        size="sm"
                        className="rounded-pill"
                        onClick={() => handleImageDelete(img.key)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fs-5 fw-semibold">Upload New Images</Form.Label>
                <div className="mb-2">
                  <label htmlFor="customFileInput" className="btn btn-secondary">
                    Elegir archivos
                  </label>
                  <Form.Control
                    ref={fileInputRef}
                    type="file"
                    id="customFileInput"
                    multiple
                    accept="image/*"
                    onChange={(e) => setNewImages(Array.from(e.target.files))}
                    className="d-none"
                  />
                </div>
              </Form.Group>

              {newImages.length > 0 && (
                <>
                  <h6 className="mt-4 text-secondary">New Images Preview</h6>
                  <Row>
                    {newImages.map((file, index) => (
                      <Col key={index} xs={6} className="mb-3 text-center position-relative">
                        <div className="position-relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="img-thumbnail rounded"
                            style={{
                              height: "150px",
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1 rounded-circle"
                            onClick={() => {
                              const updatedImages = [...newImages]
                              updatedImages.splice(index, 1)
                              setNewImages(updatedImages)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = null
                              }
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs="auto">
              <Button variant="outline-primary" onClick={() => navigate("/user/publications")}>
                Cancel
              </Button>
            </Col>
            <Col xs="auto">
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  )
}

export default EditProduct
