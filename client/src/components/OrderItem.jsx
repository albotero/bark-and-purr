import { FaArrowDownShortWide, FaArrowDownWideShort } from "react-icons/fa6"

const OrderItem = ({ data: { key, text, order, setOrder } }) => {
  const [orderKey, orderDirection] = order.split("_")
  const isOrderedByItem = orderKey === key
  const direction = orderDirection || "desc"
  const newDirection = isOrderedByItem && orderDirection === "desc" ? "asc" : "desc"

  const handleClick = () => setOrder(`${key}_${newDirection}`)

  return (
    <p className="order-item" onClick={handleClick}>
      {isOrderedByItem &&
        (direction === "asc" ? (
          <FaArrowDownShortWide className="order-icon" />
        ) : (
          <FaArrowDownWideShort className="order-icon" />
        ))}
      {text}
    </p>
  )
}

export default OrderItem
