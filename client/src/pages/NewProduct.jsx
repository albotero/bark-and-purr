import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/esm/Form";
import Swal from "sweetalert2";
import { FiUploadCloud } from "react-icons/fi";
import { Link } from "react-router-dom";

const NewProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.price < 0 || formData.stock < 0) {
      await Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "Price and stock cannot be negative.",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to publish this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, publish it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    const userId = 1;
    const stored = JSON.parse(localStorage.getItem("products")) || [];

    const newProduct = {
      ...formData,
      id: Date.now(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      ownerId: userId,
      image: formData.image ? URL.createObjectURL(formData.image) : null,
    };

    localStorage.setItem("products", JSON.stringify([...stored, newProduct]));

    await Swal.fire({
      icon: "success",
      title: "Published!",
      text: "Product successfully published.",
      confirmButtonText: "OK",
    });

    navigate("/user/publications");
  };

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
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <span className="h5 d-block mb-3 fw-bold">Basic Information</span>
              <Form.Group className="mb-3">
                <Form.Label>Product Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <span className="h5 d-block mb-3 fw-bold">Price and Stock</span>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min={0}
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
                />
              </Form.Group>
            </Col>
          </Row>

          <span className="h5 d-block mt-4 fw-bold">Images</span>
          <Form.Group
            className="mb-4 border border-2 p-4 text-center bg-light"
            style={{ borderStyle: "dashed" }}
          >
            <Form.Label htmlFor="image-upload" className="d-block">
              <FiUploadCloud size={48} className="text-secondary mb-2" />
              <span className="d-block">Upload Images</span>
            </Form.Label>
            <Form.Control
              type="file"
              name="image"
              id="image-upload"
              onChange={handleChange}
              accept="image/*"
              className="d-none"
            />
          </Form.Group>

          <Row className="justify-content-end">
            <Col xs="auto">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant="primary" type="submit">
                Publish
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default NewProduct;
