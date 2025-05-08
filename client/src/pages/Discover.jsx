import "../styles/Discover.css"
import { useEffect, useState } from "react"
import { FaArrowRight } from "react-icons/fa6"
import { FiFilter } from "react-icons/fi"
import Col from "react-bootstrap/esm/Col"
import Container from "react-bootstrap/esm/Container"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/esm/Row"
import Pagination from "react-bootstrap/Pagination"
import EditIcon from "../components/EditIcon"
import OrderItem from "../components/OrderItem"
import PriceSelector from "../components/PriceSelector"
import { ProductCard } from "../components/ProductCard"
import { useTranslation } from "react-i18next"
import { useApi } from "../hooks/useApi"

const orderOptions = ["price", "rating", "date"]
const resultsPerPageOptions = [5, 10, 20, 50]

const Discover = () => {
  const [resultsPerPage, setResultsPerPage] = useState(resultsPerPageOptions[0])
  const [order, setOrder] = useState("price_desc")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [productsData, setProductsData] = useState({})
  const { total_products: totalProducts, filters, order_by: orderBy, pages, results: products } = productsData
  console.log({ totalProducts, filters, orderBy, pages, products })
  const { t } = useTranslation("discover")
  const [fetchProducts] = useApi()

  // Fetch products at load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const data = await fetchProducts({
        endpoint: "products",
        query: { results_per_page: resultsPerPage },
        error: t("error_fetching"),
      })
      setProductsData(data)
      setIsLoading(false)
    }
    fetchData()
  }, [fetchProducts, resultsPerPage, t])

  const handleSearchQueryChange = ({ target: { value } }) => setSearchQuery(value)

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const data = await fetchProducts({
      endpoint: "products",
      query: { search: encodeURIComponent(searchQuery.toLowerCase()) },
      error: t("error_fetching"),
    })
    setProductsData(data)
    setIsLoading(false)
  }

  const handleResultsPerPageChange = async (pageUrl, value) => {
    const fullUrl = pageUrl.replace(`results_per_page=${resultsPerPage}`)
    setIsLoading(true)
    setResultsPerPage(value)
    const data = await fetchProducts({ fullUrl })
    setProductsData(data)
    setIsLoading(false)
  }

  const handlePageChange = async (fullUrl) => {
    setIsLoading(true)
    const data = await fetchProducts({ fullUrl, error: t("error_fetching") })
    setProductsData(data)
    setIsLoading(false)
  }

  const handleClearFilters = () => {
    alert("Filters cleared!")
  }

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
        {totalProducts == 0 ? (
          "Nothing here! :("
        ) : (
          <>
            <Row className="mx-3 my-4">
              {/* Gallery of filtered Products */}
              {isLoading
                ? "LOADING..."
                : productsData.error
                ? "ERROR FETCHING"
                : products?.map((product) => (
                    <Col key={product.id} xs={12} lg={6} xl={4} xxl={3} className="py-4 pt-lg-2 pb-lg-3">
                      <ProductCard product={product} />
                    </Col>
                  ))}
            </Row>

            {pages && (
              <Row>
                <Col className="d-flex justify-content-center mb-4">
                  <div className="d-flex flex-column align-items-center">
                    <p className="m-0">
                      {t("page.current", {
                        start: (pages.page - 1) * resultsPerPage + 1,
                        end: Math.min(pages.page * resultsPerPage, totalProducts),
                        total_products: totalProducts,
                        current: pages.page,
                        total: pages.total,
                      })}
                    </p>
                    <Pagination>
                      {pages.first && <Pagination.First onClick={() => handlePageChange(pages.first)} />}
                      {pages.prev && <Pagination.Prev onClick={() => handlePageChange(pages.prev)} />}
                      {pages.total > 1 && <Pagination.Item active>{pages.page}</Pagination.Item>}
                      {pages.next && <Pagination.Next onClick={() => handlePageChange(pages.next)} />}
                      {pages.last && <Pagination.Last onClick={() => handlePageChange(pages.last)} />}
                    </Pagination>
                  </div>
                </Col>
              </Row>
            )}
          </>
        )}
      </Container>

      {/* Filter => Desktop view */}
      <aside className="filter-results-container order-2">
        <div className="filter-results d-none d-lg-block rounded">
          <h4 className="d-flex">
            {t("filter.title")}
            <EditIcon callback={handleClearFilters} type="clean" />
          </h4>
          <h6>{t("filter.price")}</h6>
          <PriceSelector />
          <h6>{t("filter.stock")}</h6>
          <div className="d-flex gap-2 align-items-center">
            <span className="flex-shrink-0">{t("filter.stock_a")}</span>
            <Form.Control type="number" min={0} size="sm" className="filter-input" />
            <span className="flex-shrink-0">{t("filter.stock_b")}</span>
          </div>
          <hr />
          <h4>{t("order.title")}</h4>
          <div className="w-100 d-flex justify-content-evenly">
            {orderOptions.map((key) => (
              <OrderItem key={`order_${key}`} data={{ key, text: t(`order.${key}`), order, setOrder }} />
            ))}
          </div>
          <hr />
          <h4>{t("page.title")}</h4>
          <DropdownButton title={t("page.results_per_page", { num: resultsPerPage })}>
            {resultsPerPageOptions.map((r) => (
              <Dropdown.Item
                as="button"
                key={`results-${r}`}
                onClick={() => handleResultsPerPageChange(pages?.this, r)}
              >
                {t("page.results_per_page", { num: r })}
              </Dropdown.Item>
            ))}
          </DropdownButton>
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
          <div className="filter-indicator">{filters?.length}</div>
        </div>
      </aside>
    </div>
  )
}

export default Discover
