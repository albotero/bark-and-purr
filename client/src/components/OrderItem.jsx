import { BsSortDown, BsSortDownAlt } from "react-icons/bs"

const OrderItem = ({ data: { key, text, order, setOrder } }) => {
  const [orderKey, orderDirection] = order.split("_")
  const isOrderedByItem = orderKey === key
  const direction = orderDirection || "desc"
  const newDirection = isOrderedByItem && orderDirection === "desc" ? "asc" : "desc"

  const handleClick = () => setOrder(`${key}_${newDirection}`)

  return (
    <p className="order-item" onClick={handleClick}>
      {text}
      {isOrderedByItem &&
        (direction === "asc" ? <BsSortDownAlt className="order-icon" /> : <BsSortDown className="order-icon" />)}
    </p>
  )
}

export default OrderItem
