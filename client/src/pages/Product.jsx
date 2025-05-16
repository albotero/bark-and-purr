import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { HiTranslate } from "react-icons/hi"
import ErrorMsg from "../components/ErrorMsg"
import Loading from "../components/Loading"
import Reviews from "../components/Reviews"
import { useCart } from "../context/CartContext"
import { useUser } from "../context/UserContext"
import { useApi } from "../hooks/useApi"
import getLangName from "../utils/langName"

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
  const { t, i18n } = useTranslation("product")

  const { message, id, title, images, discount, price, stock, brand, description, vendor } = product
  const { total_reviews: totalReviews } = reviews
  const discounted = discount > 0
  const finalPrice = price * (1 - (discount || 0))

  useEffect(() => {
    if (!productId) return
    const fetchProductData = async () => {
      const [productData, reviewsData, ratingData] = await Promise.all([
        fetchData({ endpoint: `product/${i18n.language}/${productId}` }),
        fetchData({ endpoint: `product/${i18n.language}/${productId}/reviews` }),
        fetchData({ endpoint: `product/${productId}/rating` }),
      ])
      setProduct(productData)
      setReviews(reviewsData)
      setRating(Number(ratingData.rating))
    }
    fetchProductData()
  }, [productId, fetchData, i18n.language])

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
        ← {t("go_back")}
      </button>

      <div className="row">
        <div className="col-md-6">
          {images && (
            <>
              <div className="position-relative mb-3">
                <img src={images[activeImage]} alt={title.content} className="img-fluid rounded" />
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
          <div className="mb-3">
            <h2 className="m-0">{title.content}</h2>
            {title.translated && (
              <div className="text-muted small fst-italic d-flex gap-1 align-items-center">
                <HiTranslate />
                {t("automatically_translated", {
                  sourceLang: getLangName(title.sourceLang, title.targetLang),
                })}
              </div>
            )}
          </div>

          <div className="mb-2">
            <span className="text-warning">★</span> {rating} ({t("total_reviews", { totalReviews })})
          </div>

          <div className="d-flex align-items-baseline gap-2 mb-2">
            <h4 className="text-primary">${finalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h4>
            {discounted && (
              <del className="text-muted">${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</del>
            )}
          </div>

          <div className={`mb-2 ${stock > 0 ? "text-success" : "text-danger"}`}>
            {stock > 0 ? t("in_stock", { stock }) : t("out_of_stock")}
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
                  title: t("alert.title"),
                  text: t("alert.content"),
                  showCancelButton: true,
                  confirmButtonText: t("alert.ok"),
                  cancelButtonText: t("alert.cancel"),
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate("/login")
                  }
                })
                return
              }

              addToCart({
                id: productId,
                title: title.content,
                price: parseFloat(finalPrice),
                img: images?.[0],
                quantity,
              })
            }}
            disabled={stock === 0}
          >
            🛒 {t("add_to_cart")}
          </button>

          <ul className="list-unstyled text-muted small">
            {brand && (
              <li>
                <strong>{t("brand")}:</strong> {brand}
              </li>
            )}
            <li>
              <strong>{t("seller")}:</strong> {vendor}
            </li>
            <li>🚚 {t("free_shipping", { price: 999 })}</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <ul className="nav nav-tabs mb-3" id="productTabs" role="tablist">
          {[
            { key: "desc", label: t("description") },
            { key: "reviews", label: t("reviews.title", { totalReviews }) },
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
          {activeTab === "desc" && (
            <div className="mx-1 my-2">
              <p className="m-0">{description.content}</p>
              {description.translated && (
                <div className="text-muted small fst-italic d-flex gap-1 align-items-center">
                  <HiTranslate />
                  {t("automatically_translated", {
                    sourceLang: getLangName(description.sourceLang, description.targetLang),
                  })}
                </div>
              )}
            </div>
          )}
          {activeTab === "reviews" && <Reviews reviews={reviews} setReviews={setReviews} />}
        </div>
      </div>
    </div>
  )
}

export default Product
