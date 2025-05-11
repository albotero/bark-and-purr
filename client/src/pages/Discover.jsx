import "../styles/Discover.css"
import { useEffect, useState } from "react"
import { FaArrowRight, FaXmark } from "react-icons/fa6"
import { FiFilter } from "react-icons/fi"
import Masonry from "react-masonry-css"
import Swal from "sweetalert2"
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
import Loading from "../components/Loading"
import NoProducts from "../components/NoProducts"
import { ProductCard } from "../components/ProductCard"
import { useTranslation } from "react-i18next"
import { useApi } from "../hooks/useApi"

const orderOptions = ["price", "rating", "date"]
const resultsPerPageOptions = [10, 20, 50]
const initialFilters = { results_per_page: resultsPerPageOptions[0], min_stock: 1, order_by: "price_desc" }

const Discover = () => {
  const [order, setOrder] = useState(initialFilters.order_by)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [productsData, setProductsData] = useState({})
  const { total_products: totalProducts, filters, pages, results: products, histogram } = productsData

  const { t } = useTranslation("discover")
  const [fetchProducts] = useApi()

  // Fetch products at load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const data = await fetchProducts({
        endpoint: "products",
        query: initialFilters,
      })
      setProductsData(data)
      setIsLoading(false)
    }
    fetchData()
  }, [fetchProducts, t])

  const updateQuery = async (pageUrl, key, value) => {
    const regex = new RegExp(`${key}=[\\d\\w]+&?`, "g")
    const uriValue = encodeURIComponent(value)
    const fullUrl = pageUrl
      // Remove previous filters
      .replace(regex, "")
      // Remove trailing &
      .replace(/&$/, "")
      // Append new filters
      .concat(`&${key}=${uriValue}`)
    setIsLoading(true)
    const data = await fetchProducts({ fullUrl })
    setProductsData(data)
    setIsLoading(false)
  }

  const handleSearchQueryChange = ({ target: { value } }) => {
    setSearchQuery(value)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const data = await fetchProducts({
      endpoint: "products",
      query: { search: encodeURIComponent(searchQuery.toLowerCase()) },
    })
    setProductsData(data)
    setOrder(data.order_by)
    setIsLoading(false)
  }

  const handleClearSearch = async () => {
    setSearchQuery("")
    setIsLoading(true)
    const data = await fetchProducts({
      endpoint: "products",
      query: initialFilters,
    })
    setProductsData(data)
    setIsLoading(false)
  }

  const handleStockFilterChange = (pageUrl, value) => {
    updateQuery(pageUrl, "min_stock", value)
  }

  const handleResultsPerPageChange = (pageUrl, value) => {
    updateQuery(pageUrl, "results_per_page", value)
  }

  const handlePageChange = async (fullUrl) => {
    setIsLoading(true)
    const data = await fetchProducts({ fullUrl })
    setProductsData(data)
    setIsLoading(false)
  }

  const handleClearFilters = async () => {
    setIsLoading(true)
    const data = await fetchProducts({
      endpoint: "products",
      query: initialFilters,
    })
    setProductsData(data)
    setOrder(initialFilters.order_by)
    setSearchQuery("")
    setIsLoading(false)

    Swal.fire({
      title: t("alert.success"),
      text: t("alert.filters_cleared"),
      icon: "success",
      confirmButtonText: t("alert.ok"),
    })
  }

  const handleOrderClick = (pageUrl, value) => {
    updateQuery(pageUrl, "order_by", value)
    setOrder(value)
  }

  return (
    <div className="d-flex flex-column flex-lg-row">
      {productsData.error ? (
        <NoProducts error={productsData.error} />
      ) : (
        <>
          <Container className="order-2 order-lg-1">
            <Form className="search-bar mx-auto my-2 my-lg-4" onSubmit={handleSearch}>
              <Form.Control
                type="text"
                placeholder={"🔍 " + t("search")}
                className="rounded-pill"
                value={searchQuery}
                onChange={handleSearchQueryChange}
              />
              {searchQuery && (
                <div className="search-controls">
                  <FaArrowRight className="search-button" onClick={handleSearch} />
                  <FaXmark className="search-button text-danger" onClick={handleClearSearch} />
                </div>
              )}
            </Form>
            {totalProducts == 0 ? (
              <NoProducts />
            ) : isLoading ? (
              <Loading />
            ) : (
              <>
                {/* Gallery of filtered Products */}
                <Masonry
                  breakpointCols={{ default: 4 /* xxl */, 1400: 3 /* lg */, 768: 2 /* md */, 576: 1 /* sm */ }}
                  className="masonry-grid"
                >
                  {products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Masonry>

                {pages && (
                  <Row>
                    <Col className="d-flex justify-content-center mb-4">
                      <div className="d-flex flex-column align-items-center">
                        <p className="m-0">
                          {t("page.current", {
                            start: (pages.page - 1) * pages.results_per_page + 1,
                            end: Math.min(pages.page * pages.results_per_page, totalProducts),
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

          {totalProducts > 0 && (
            <>
              <aside className="filter-results-container order-2">
                {/* Filter => Desktop view */}
                <div className="filter-results d-none d-lg-block rounded">
                  <h4 className="d-flex">
                    {t("filter.title")}
                    <EditIcon callback={handleClearFilters} type="clean" />
                  </h4>
                  <h6>{t("filter.price")}</h6>
                  <PriceSelector
                    histogram={histogram}
                    url={pages?.this}
                    setIsLoading={setIsLoading}
                    setProductsData={setProductsData}
                  />
                  <h6>{t("filter.stock")}</h6>
                  <div className="d-flex gap-2 align-items-center">
                    <span className="flex-shrink-0">{t("filter.stock_a")}</span>
                    <Form.Control
                      type="number"
                      min={1}
                      defaultValue={1}
                      size="sm"
                      className="filter-input"
                      onChange={({ target: { value } }) => handleStockFilterChange(pages?.this, value)}
                    />
                    <span className="flex-shrink-0">{t("filter.stock_b")}</span>
                  </div>
                  <hr />
                  <h4>{t("order.title")}</h4>
                  <div className="w-100 d-flex flex-wrap gap-2 justify-content-center">
                    {orderOptions.map((key) => (
                      <OrderItem
                        key={`order_${key}`}
                        data={{
                          key,
                          text: t(`order.${key}`),
                          order,
                          setOrder: (val) => handleOrderClick(pages?.this, val),
                        }}
                      />
                    ))}
                  </div>
                  <hr />
                  <h4>{t("page.title")}</h4>
                  <DropdownButton title={t("page.results_per_page", { num: pages?.results_per_page })}>
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

              <aside className="filter-results mobile d-lg-none order-1">
                {/* Filter => Mobile view */}
                <div className="d-flex gap-3">
                  {orderOptions.map((key) => (
                    <OrderItem
                      key={`order_${key}`}
                      data={{
                        key,
                        text: t(`order.${key}`),
                        order,
                        setOrder: (val) => handleOrderClick(pages?.this, val),
                      }}
                    />
                  ))}
                </div>
                <div className="border-start border-secondary m-2">&nbsp;</div>
                <div className="d-flex gap-1">
                  <FiFilter />
                  <div className="filter-indicator">{filters?.length}</div>
                </div>
              </aside>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Discover
