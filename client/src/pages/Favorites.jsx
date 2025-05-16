import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { FaHeartBroken } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import { ProductCard } from "../components/ProductCard"
import Loading from "../components/Loading"
import ErrorMsg from "../components/ErrorMsg"
import { useFavorites } from "../context/FavoritesContext"

const Favorites = () => {
  const { t } = useTranslation("favorites")
  const { favorites, isLoading, error } = useFavorites()

  if (isLoading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  return (
    <Container className="section-padding">
      <h2 className="mb-4">
        {t("title")} ({favorites.length})
      </h2>
      {favorites.length === 0 ? (
        <div className="text-center">
          <FaHeartBroken size={48} className="text-danger mb-2" />
          <p>{t("favorites.emptyMessage")}</p>
        </div>
      ) : (
        <Row className="g-4">
          {favorites.map((product) => (
            <Col key={product.id} sm={12} md={6} lg={4}>
              <ProductCard product={product} showAddToCart={true} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Favorites
