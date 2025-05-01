import "../styles/Discover.css"
import { useState } from "react"
import { FaArrowRight } from "react-icons/fa6"
import { FiFilter } from "react-icons/fi"
import Col from "react-bootstrap/esm/Col"
import Container from "react-bootstrap/esm/Container"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/esm/Row"
import Pagination from "react-bootstrap/Pagination"
import EditIcon from "../components/EditIcon"
import OrderItem from "../components/OrderItem"
import PriceSelector from "../components/PriceSelector"
import { ProductCard } from "../components/ProductCard"
import { useTranslation } from "react-i18next"

const orderOptions = ["price", "rating", "date"]

const Discover = () => {
  const [order, setOrder] = useState("price_desc")
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useTranslation("discover")

  const handleSearchQueryChange = ({ target: { value } }) => setSearchQuery(value)

  const handleSearch = (e) => {
    alert(`Searching... ${searchQuery}`)
    e.preventDefault()
  }

  const handleClearFilters = () => {
    alert("Filters cleared!")
  }

  /* Mock Data */
  const products = [
    { id: "p001", title: "Product1", price: 10200 },
    { id: "p002", title: "Product2", price: 8200 },
    { id: "p003", title: "Product3", price: 4000 },
    { id: "p004", title: "Product4", price: 13400 },
    { id: "p005", title: "Product5", price: 1200 },
    { id: "p006", title: "Product6", price: 6700, img: "/vite.svg" },
    { id: "p007", title: "Product7", price: 4500 },
  ]

  return (
    <div className="d-flex flex-column flex-lg-row">
      <Container className="order-2 order-lg-1">
        <Form className="search-bar mx-auto my-2 my-lg-4" onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder={"🔍 " + t("search")}
            className="rounded-pill"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          {searchQuery && <FaArrowRight className="search-button" onClick={handleSearch} />}
        </Form>

        <Row className="mx-3 my-4">
          {/* Gallery of filtered Products */}
          {products.map((product) => (
            <Col key={product.id} xs={12} lg={6} xl={4} xxl={3} className="py-4 pt-lg-2 pb-lg-3">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        <Row>
          <Col className="d-flex justify-content-center mb-4">
            <Pagination>
              <Pagination.First />
              <Pagination.Prev />

              <Pagination.Item>{4}</Pagination.Item>
              <Pagination.Item>{5}</Pagination.Item>
              <Pagination.Item active>{6}</Pagination.Item>
              <Pagination.Item>{7}</Pagination.Item>
              <Pagination.Item disabled>{8}</Pagination.Item>

              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </Col>
        </Row>
      </Container>

      {/* Filter => Desktop view */}
      <aside className="filter-results d-none d-lg-block order-2">
        <h4 className="d-flex">
          {t("filter.title")}
          <EditIcon callback={handleClearFilters} type="clean" />
        </h4>
        <h6>{t("filter.price")}</h6>
        <PriceSelector />
        <h6>{t("filter.stock")}</h6>
        <div className="d-flex gap-2 align-items-center">
          <span className="flex-shrink-0">{t("filter.stock_a")}</span>
          <Form.Control type="number" min={0} size="sm" className="w-25" />
          <span className="flex-shrink-0">{t("filter.stock_b")}</span>
        </div>
        <hr />
        <h4>{t("order.title")}</h4>
        <div className="w-100 d-flex justify-content-evenly">
          {orderOptions.map((key) => (
            <OrderItem key={`order_${key}`} data={{ key, text: t(`order.${key}`), order, setOrder }} />
          ))}
        </div>
      </aside>

      {/* Filter => Mobile view */}
      <aside className="filter-results mobile d-lg-none order-1">
        <div className="d-flex gap-3">
          {orderOptions.map((key) => (
            <OrderItem key={`order_${key}`} data={{ key, text: t(`order.${key}`), order, setOrder }} />
          ))}
        </div>
        <div className="border-start border-secondary m-2">&nbsp;</div>
        <div className="d-flex gap-1">
          <FiFilter />
          <div className="filter-indicator">1</div>
        </div>
      </aside>
    </div>
  )
}

export default Discover
