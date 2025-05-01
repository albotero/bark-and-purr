import React, { useEffect, useState } from "react"
import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"
import { ProductCard } from "../components/ProductCard"
import Button from "react-bootstrap/Button"
import { FaHeartBroken } from "react-icons/fa"
import { useTranslation } from "react-i18next"

const Favorites = () => {
  const { t } = useTranslation("favorites")
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Array de prueba
    setFavorites([
      {
        id: 1,
        title: "Comida para perro",
        img: "/images/dog-food.jpg",
        price: 14990,
        description: "Alimento premium para perros",
      },
      {
        id: 2,
        title: "Juguete para gato",
        img: "/images/cat-toy.jpg",
        price: 7990,
        description: "Juguete interactivo para gatos",
      },
    ])
  }, [])

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <Container className="section-padding">
      {/* Mostrar el número de favoritos al lado del título */}
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
              <div className="position-relative">
                <ProductCard product={product} showAddToCart={true} />
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={() => removeFromFavorites(product.id)}
                  title={t("favorites.remove")}
                >
                  <FaHeartBroken />
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default Favorites
