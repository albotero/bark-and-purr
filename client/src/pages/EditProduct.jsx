import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import  Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Swal from "sweetalert2";

const EditProduct = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/publications/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          stock: data.stock,
        });
        setExistingImages(data.images || []);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageDelete = async (publicId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setImagesToDelete((prev) => [...prev, publicId]);
    setExistingImages((prev) => prev.filter((img) => img.key !== publicId));
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save the changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("imagesToDelete", JSON.stringify(imagesToDelete));

    newImages.forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/publications/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al actualizar la publicación"
        );
      }

      const updatedData = await response.json();
      console.log("Updated publication:", updatedData);
      Swal.fire("Success!", "The post has been updated.", "success");
      navigate("/user/publications");
    } catch (error) {
      console.error("Error updating publication:", error);
      Swal.fire("Error", "There was an error updating the post.", "error");
    }
  };

  return (
    <Container className="my-4">
      <Card className="p-4">
        <h2>Edit Product</h2>
        <Form onSubmit={handleEditSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fs-4">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
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
            {/* Existing Images */}
            <Col md={6}>
              <h5 className="text-primary mb-3">Existing Images</h5>
              <Row>
                {existingImages.map((img) => (
                  <Col key={img.key} xs={6} className="mb-3 text-center">
                    <img
                      src={img.url}
                      alt="Product"
                      className="img-fluid rounded-3 shadow-sm"
                      style={{ maxHeight: "150px", objectFit: "cover" }}
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

            {/* Upload New Images */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fs-5 fw-semibold me-3">
                  Upload New Images
                </Form.Label>
                <div
                  className="form-control"
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid #ced4da",
                    borderRadius: "0.5rem",
                    backgroundColor: "#795548",
                    color: "#fff",
                    fontWeight: "500",
                    cursor: "pointer",
                    width: "fit-content",
                    display: "inline-block",
                  }}
                  onClick={() =>
                    document.getElementById("customFileInput").click()
                  }
                >
                  Elegir archivos
                </div>
                <Form.Control
                  type="file"
                  id="customFileInput"
                  multiple
                  accept="image/*"
                  onChange={(e) => setNewImages(Array.from(e.target.files))}
                  style={{ display: "none" }}
                />
              </Form.Group>

              {newImages.length > 0 && (
                <>
                  <h6 className="mt-4 text-secondary">New Images Preview</h6>
                  <Row>
                    {newImages.map((file, index) => (
                      <Col
                        key={index}
                        xs={6}
                        className="mb-3 text-center position-relative"
                      >
                        <div style={{ position: "relative" }}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="img-fluid rounded-3 shadow-sm"
                            style={{
                              width: "100%",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              borderRadius: "50%",
                              padding: "0.25rem 0.5rem",
                              lineHeight: "1",
                            }}
                            onClick={() => {
                              const updatedImages = [...newImages];
                              updatedImages.splice(index, 1);
                              setNewImages(updatedImages);
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
              <Button
                variant="outline-primary"
                onClick={() => navigate("/user/publications")}
              >
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
  );
};

export default EditProduct;

