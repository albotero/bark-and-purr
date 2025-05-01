import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import Swal from "sweetalert2";

const mockProduct = {
  id: "p123",
  name: "Royal Canin Medium Adult - Dog Food",
  price: 89.99,
  discount: 0.15,
  stock: 18,
  brand: "Royal Canin",
  seller: "PetHappy Store",
  rating: 4.5,
  reviews: [
    {
      id: 1,
      user: "Alejandro B.",
      rating: 5,
      date: "2025-01-15",
      content:
        "Excellent product, my dog loves it and his coat has improved significantly.",
    },
    {
      id: 2,
      user: "Janis C.",
      rating: 4,
      date: "2025-02-03",
      content: "Good quality, although a bit pricey.",
    },
    {
      id: 3,
      user: "Pam Y.",
      rating: 5,
      date: "2025-03-21",
      content:
        "I always buy this one, it’s the only food that works well for my pet.",
    },
  ],
  images: [
    "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1605897472359-85e4b94d685d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ],
  description:
    "Royal Canin Medium Adult is a high-quality dry food for medium-sized adult dogs (11–25 kg) from 12 months of age. Specifically formulated to meet the nutritional needs of medium breed dogs.",
  features: [
    "Formulated for adult dogs weighing 11–25 kg",
    "Contains high-quality proteins",
    "Supports digestive health",
    "Optimal nutrient balance",
    "Promotes healthy bones and joints",
  ],
};

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");
  const { addToCart } = useCart();
  const { token } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setProduct(mockProduct), 300);
  }, [id]);

  if (!product) return <div className="text-center mt-5">Loading product...</div>;

  const discounted = product.discount > 0;
  const finalPrice = (product.price * (1 - product.discount)).toFixed(2);

  return (
    <div className="container mt-4 bg-white">
      <button className="btn btn-link mb-3" onClick={() => window.history.back()}>
        ← Back to products
      </button>
      <div className="row">
        <div className="col-md-6">
          <div className="position-relative mb-3">
            <img src={product.images[0]} alt={product.name} className="img-fluid rounded" />
            {discounted && (
              <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                -{product.discount * 100}%
              </span>
            )}
          </div>
          <div className="d-flex gap-2 mb-4">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`View ${i}`}
                className="img-thumbnail object-fit-cover"
                style={{ width: "70px", height: "70px", objectFit: "cover" }}
              />
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <div className="text-muted small mb-2">Food / Dogs / New</div>
          <h2>{product.name}</h2>
          <div className="mb-2">
            <span className="text-warning">★</span> {product.rating} ({product.reviews.length} reviews)
          </div>

          <div className="d-flex align-items-baseline gap-2 mb-2">
            <h4 className="text-primary">${finalPrice}</h4>
            {discounted && <del className="text-muted">${product.price}</del>}
          </div>

          <div className={`mb-2 ${product.stock > 0 ? "text-success" : "text-danger"}`}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </div>

          <div className="input-group mb-3" style={{ width: "150px" }}>
            <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
              -
            </button>
            <input type="text" className="form-control text-center" value={quantity} readOnly />
            <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => q + 1)}>
              +
            </button>
          </div>

          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              if (!token) {
                Swal.fire({
                  icon: "warning",
                  title: "You're not logged in",
                  text: "Please log in or register to add items to your cart.",
                  showCancelButton: true,
                  confirmButtonText: "Go to Login",
                  cancelButtonText: "Cancel",
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate("/login");
                  }
                });
                return;
              }

              addToCart({
                id: product.id,
                title: product.name,
                price: parseFloat(finalPrice),
                img: product.images?.[0],
                quantity,
              });
            }}
            disabled={product.stock === 0}
          >
            🛒 Add to cart
          </button>

          <ul className="list-unstyled text-muted small">
            <li><strong>Brand:</strong> {product.brand}</li>
            <li><strong>Seller:</strong> <a href="#">{product.seller}</a></li>
            <li>🚚 Free shipping on orders over $999</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <ul className="nav nav-tabs mb-3" id="productTabs" role="tablist">
          {[
            { key: "desc", label: "Description" },
            { key: "reviews", label: `Reviews (${product.reviews.length})` },
            { key: "features", label: "Features" },
          ].map(tab => (
            <li className="nav-item" role="presentation" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? "active bg-primary text-white fw-bold" : "bg-light text-dark"}`}
                type="button"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content border p-3">
          {activeTab === "desc" && <p>{product.description}</p>}

          {activeTab === "reviews" && (
            <div>
              {product.reviews.map((r) => (
                <div key={r.id} className="mb-3 border-bottom pb-2">
                  <strong>{r.user}</strong> <span className="text-warning">{"★".repeat(r.rating)}</span>
                  <div className="text-muted small">{r.date}</div>
                  <p className="mb-1">{r.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "features" && (
            <ul className="list-group list-group-flush">
              {product.features.map((f, i) => (
                <li key={i} className="list-group-item">{f}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;