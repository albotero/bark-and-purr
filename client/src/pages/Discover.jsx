import "../styles/Discover.css"
import { useEffect, useState } from "react"
import { FaArrowRight, FaXmark } from "react-icons/fa6"
import { useTranslation } from "react-i18next"
import Masonry from "react-masonry-css"
import Col from "react-bootstrap/esm/Col"
import Container from "react-bootstrap/esm/Container"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/esm/Row"
import Pagination from "react-bootstrap/Pagination"
import Loading from "../components/Loading"
import ErrorMsg from "../components/ErrorMsg"
import { ProductCard } from "../components/ProductCard"
import ProductFilters from "../components/ProductFilters"
import { useApi } from "../hooks/useApi"

const resultsPerPageOptions = [10, 20, 50]
const initialFilters = { results_per_page: resultsPerPageOptions[0], order_by: "rating_desc" }

const Discover = () => {
  const [order, setOrder] = useState(initialFilters.order_by)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [productsData, setProductsData] = useState({})
  const { total_products: totalProducts, filters, pages, results: products } = productsData
  const [filtersData, setFiltersData] = useState({
    minPrice: filters?.min_price,
    maxPrice: filters?.max_price,
    minStock: filters?.min_stock,
  })

  const { t, i18n } = useTranslation("discover")
  const [fetchProducts] = useApi()

  // Fetch products at load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const data = await fetchProducts({
        endpoint: `products/${i18n.language}`,
        query: initialFilters,
      })
      setProductsData(data)
      setIsLoading(false)
    }
    fetchData()
  }, [fetchProducts, t, i18n.language])

  const handleSearchQueryChange = ({ target: { value } }) => {
    setSearchQuery(value)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const data = await fetchProducts({
      endpoint: `products/${i18n.language}`,
      query: { search: encodeURIComponent(searchQuery) },
    })
    setProductsData(data)
    setOrder(data.order_by)
    setIsLoading(false)
  }

  const handleClearSearch = async () => {
    setSearchQuery("")
    setIsLoading(true)
    const data = await fetchProducts({
      endpoint: `products/${i18n.language}`,
      query: initialFilters,
    })
    setProductsData(data)
    setIsLoading(false)
  }

  const handlePageChange = async (fullUrl) => {
    setIsLoading(true)
    const data = await fetchProducts({ fullUrl })
    setProductsData(data)
    setIsLoading(false)
  }

  return (
    <div className="d-flex flex-column flex-lg-row">
      {productsData.error ? (
        <ErrorMsg error={productsData.error} />
      ) : (
        <>
          <Container className="order-2 order-lg-1">
            <Form className="search-bar" onSubmit={handleSearch}>
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
              <ErrorMsg />
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

          {
            /* Only hide filter if no products found just for search, not for filtering */
            (totalProducts === 0 && filters?.length === 1 && filters[0].key === "search") || (
              <ProductFilters
                filters={filters}
                filtersData={filtersData}
                setFiltersData={setFiltersData}
                initialFilters={initialFilters}
                resultsPerPageOptions={resultsPerPageOptions}
                order={order}
                setOrder={setOrder}
                productsData={productsData}
                setProductsData={setProductsData}
                setIsLoading={setIsLoading}
                setSearchQuery={setSearchQuery}
              />
            )
          }
        </>
      )}
    </div>
  )
}

export default Discover
