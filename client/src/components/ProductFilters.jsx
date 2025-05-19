import "../styles/ProductFilters.css"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FiFilter } from "react-icons/fi"
import Swal from "sweetalert2"
import Button from "react-bootstrap/esm/Button"
import Dropdown from "react-bootstrap/esm/Dropdown"
import DropdownButton from "react-bootstrap/esm/DropdownButton"
import Form from "react-bootstrap/esm/Form"
import PriceSelector from "./PriceSelector"
import EditIcon from "./EditIcon"
import OrderItem from "./OrderItem"
import { useApi } from "../hooks/useApi"

const orderOptions = ["rating", "price", "date"]

const ProductFilters = ({
  filters,
  filtersData,
  setFiltersData,
  initialFilters,
  resultsPerPageOptions,
  order,
  setOrder,
  productsData: { histogram, pages },
  setProductsData,
  setIsLoading,
  setSearchQuery,
}) => {
  const [selPrice, setSelPrice] = useState([filtersData.minPrice, filtersData.maxPrice])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [fetchProducts] = useApi()
  const { t, i18n } = useTranslation("discover")

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

  const handleMinPriceFilterChange = (pageUrl, value) => {
    const max = Math.max(value, filters.maxPrice, filters.minPrice) || selPrice[1]
    updateQuery(pageUrl, "min_price", value)
    setFiltersData((prev) => ({ ...prev, minPrice: value, maxPrice: max }))
    setSelPrice([value, max])
  }

  const handleMaxPriceFilterChange = (pageUrl, value) => {
    const min = Math.min(filters.minPrice, filters.maxPrice, value) || selPrice[0]
    updateQuery(pageUrl, "max_price", value)
    setFiltersData((prev) => ({ ...prev, minPrice: min, maxPrice: value }))
    setSelPrice([min, value])
  }

  const handleStockFilterChange = (pageUrl, value) => {
    updateQuery(pageUrl, "min_stock", value)
    setFiltersData((prev) => ({ ...prev, minStock: value }))
  }

  const handleResultsPerPageChange = (pageUrl, value) => {
    updateQuery(pageUrl, "results_per_page", value)
  }

  const handleClearFilters = async () => {
    setIsLoading(true)
    const data = await fetchProducts({
      endpoint: `products/${i18n.language}`,
      query: initialFilters,
    })
    setProductsData(data)
    setOrder(initialFilters.order_by)
    setSearchQuery("")
    setFiltersData({})
    setIsLoading(false)
    setSelPrice([])

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

  const handleShowMobileFilters = () => {
    setShowMobileFilters((prev) => !prev)
  }

  return (
    <aside className="filter-results-container">
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
          selPrice={selPrice}
          setSelPrice={setSelPrice}
        />
        <h6>{t("filter.stock")}</h6>
        <div className="d-flex gap-2 align-items-center">
          <span className="flex-shrink-0">{t("filter.stock_a")}</span>
          <Form.Control
            type="number"
            min={0}
            value={filtersData.minStock}
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
            <Dropdown.Item as="button" key={`results-${r}`} onClick={() => handleResultsPerPageChange(pages?.this, r)}>
              {t("page.results_per_page", { num: r })}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>

      <div className="d-lg-none">
        <div className="filter-results mobile">
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
          <Button variant="outline-primary" className="d-flex gap-1" onClick={handleShowMobileFilters}>
            <FiFilter />
            <div className="filter-indicator">{filters?.length}</div>
          </Button>
        </div>

        {showMobileFilters && (
          <div className="filter-results mobile filters">
            <h4 className="d-flex">
              {t("filter.title")}
              <EditIcon callback={handleClearFilters} type="clean" />
            </h4>
            <div className="d-flex flex-wrap">
              <h6>{t("filter.price")}:</h6>
              <Form.Control
                type="number"
                min={0}
                value={selPrice[0]}
                size="sm"
                className="filter-input"
                onChange={({ target: { value } }) => handleMinPriceFilterChange(pages?.this, value)}
              />
              <p>-</p>
              <Form.Control
                type="number"
                min={selPrice[0]}
                value={selPrice[1]}
                size="sm"
                className="filter-input"
                onChange={({ target: { value } }) => handleMaxPriceFilterChange(pages?.this, value)}
              />
            </div>
            <div className="d-flex flex-wrap">
              <h6>{t("filter.stock")}:</h6>
              <p>{t("filter.stock_a")}</p>
              <Form.Control
                type="number"
                min={0}
                value={filtersData.minStock}
                size="sm"
                className="filter-input"
                onChange={({ target: { value } }) => handleStockFilterChange(pages?.this, value)}
              />
              <p>{t("filter.stock_b")}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default ProductFilters
