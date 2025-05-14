import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import ErrorMsg from "../components/ErrorMsg"
import Loading from "../components/Loading"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { useApi } from "../hooks/useApi"

const Product = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState({})
  const [reviews, setReviews] = useState("")
  const [rating, setRating] = useState(0)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("desc")
  const { addToCart } = useCart()
  const { token } = useUser()
  const [fetchData] = useApi()
  const navigate = useNavigate()
  const { message, id, name, images, discount, price, stock, brand, description, vendor } = product
  const { total_reviews: totalReviews, results: reviewsData } = reviews
  const discounted = discount > 0
  const finalPrice = price * (1 - (discount || 0))

  useEffect(() => {
    if (!productId) return
    const populate = async () => {
      const fetchedProduct = await fetchData({ endpoint: `product/${productId}` })
      const fetchedReviews = await fetchData({ endpoint: `product/${productId}/reviews` })
      const fetchedRating = await fetchData({ endpoint: `product/${productId}/rating` })
      setProduct(fetchedProduct)
      setReviews(fetchedReviews)
      setRating(Number(fetchedRating.rating))
    }
    populate()
  }, [productId, fetchData])

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleImageClick = ({ target }) => {
    const { imageIndex } = target.dataset
    setActiveImage(imageIndex)
  }

  return message === "not_found" ? (
    <ErrorMsg />
  ) : !id ? (
    <Loading />
  ) : (
    <div className="container mt-4 mb-5 bg-tertiary">
      <button className="btn btn-link mb-3" onClick={handleGoBack}>
        ← Go back
      </button>

      <div className="row">
        <div className="col-md-6">
          {images && (
            <>
              <div className="position-relative mb-3">
                <img src={images[activeImage]} alt={name} className="img-fluid rounded" />
                {discounted && (
                  <span className="badge bg-danger position-absolute top-0 start-0 m-2">-{discount * 100}%</span>
                )}
              </div>
              <div className="d-flex gap-2 mb-4">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`View ${i}`}
                    data-image-index={i}
                    className="img-thumbnail object-fit-cover"
                    onClick={handleImageClick}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      cursor: activeImage == i ? undefined : "pointer",
                      filter: activeImage == i ? "grayscale(60%) brightness(105%) contrast(80%)" : "none",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="col-md-6">
          <h2>{name}</h2>
          <div className="mb-2">
            <span className="text-warning">★</span> {rating} ({totalReviews} reviews)
          </div>

          <div className="d-flex align-items-baseline gap-2 mb-2">
            <h4 className="text-primary">${finalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h4>
            {discounted && (
              <del className="text-muted">${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</del>
            )}
          </div>

          <div className={`mb-2 ${stock > 0 ? "text-success" : "text-danger"}`}>
            {stock > 0 ? `In stock (${stock} available)` : "Out of stock"}
          </div>

          <div className="input-group mb-3" style={{ width: "150px" }}>
            <button className="btn btn-outline-secondary" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              -
            </button>
            <input type="text" className="form-control text-center" value={quantity} readOnly />
            <button className="btn btn-outline-secondary" onClick={() => setQuantity((q) => q + 1)}>
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
                    navigate("/login")
                  }
                })
                return
              }

              addToCart({
                id: productId,
                title: name,
                price: parseFloat(finalPrice),
                img: images?.[0],
                quantity,
              })
            }}
            disabled={stock === 0}
          >
            🛒 Add to cart
          </button>

          <ul className="list-unstyled text-muted small">
            {brand && (
              <li>
                <strong>Brand:</strong> {brand}
              </li>
            )}
            <li>
              <strong>Seller:</strong> {vendor}
            </li>
            <li>🚚 Free shipping on orders over $999</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <ul className="nav nav-tabs mb-3" id="productTabs" role="tablist">
          {[
            { key: "desc", label: "Description" },
            { key: "reviews", label: `Reviews (${totalReviews})` },
          ].map((tab) => (
            <li className="nav-item" role="presentation" key={tab.key}>
              <button
                className={`nav-link ${
                  activeTab === tab.key ? "active bg-primary text-white fw-bold" : "bg-light text-dark"
                }`}
                type="button"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content border p-3">
          {activeTab === "desc" && <p>{description}</p>}

          {activeTab === "reviews" && (
            <div>
              {reviewsData.map(({ id: reviewId, user, date, rating: reviewRating, body }) => (
                <div key={`review_${reviewId}`} className="mb-3 border-bottom pb-2">
                  <strong>{user}</strong> <span className="text-warning">{"★".repeat(reviewRating)}</span>
                  <div className="text-muted small">{new Date(date).toLocaleString()}</div>
                  <p className="mb-1">{body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Product
