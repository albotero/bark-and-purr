import "../styles/Discover.css"
import { useState } from "react"
import { FaArrowRight } from "react-icons/fa6"
import { FiFilter } from "react-icons/fi"
import Container from "react-bootstrap/esm/Container"
import Form from "react-bootstrap/Form"
import EditIcon from "../components/EditIcon"
import OrderItem from "../components/OrderItem"
import PriceSelector from "../components/PriceSelector"

const Discover = () => {
  const [order, setOrder] = useState("price_desc")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchQueryChange = ({ target: { value } }) => setSearchQuery(value)

  const handleSearch = (e) => {
    alert(`Searching... ${searchQuery}`)
    e.preventDefault()
  }

  const handleClearFilters = () => {
    alert("Filters cleared!")
  }

  /* Mock Data */
  const orderOptions = [
    { id: 1001, key: "price", text: "Price" },
    { id: 1002, key: "rating", text: "Rating" },
    { id: 1003, key: "date", text: "Date" },
  ]

  return (
    <div className="d-flex flex-column flex-lg-row">
      <Container>
        <Form className="search-bar mx-auto my-2 my-lg-4" onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="🔍 Search"
            className="rounded-pill"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          {searchQuery && <FaArrowRight className="search-button" onClick={handleSearch} />}
        </Form>

        <Container>{/* Gallery of filtered Products */}</Container>
      </Container>

      {/* Filter => Desktop view */}
      <aside className="filter-results d-none d-lg-block">
        <h4 className="d-flex">
          Filter Results
          <EditIcon callback={handleClearFilters} type="clean" />
        </h4>
        <h6>By price</h6>
        <PriceSelector />
        <h6>By available stock</h6>
        <div className="d-flex gap-2 align-items-center">
          <span className="flex-shrink-0">More than</span>
          <Form.Control type="number" min={0} size="sm" className="w-25" />
          <span className="flex-shrink-0">units</span>
        </div>
        <hr />
        <h4>Order By</h4>
        <div className="w-100 d-flex justify-content-evenly">
          {orderOptions.map(({ id: orderId, key, text }) => (
            <OrderItem key={orderId} data={{ key, text, order, setOrder }} />
          ))}
        </div>
      </aside>

      {/* Filter => Mobile view */}
      <aside className="filter-results mobile d-lg-none">
        <div className="d-flex gap-3">
          {orderOptions.map(({ id: orderId, key, text }) => (
            <OrderItem key={orderId} data={{ key, text, order, setOrder }} />
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
