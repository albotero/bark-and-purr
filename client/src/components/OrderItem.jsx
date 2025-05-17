import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa"
import Button from "react-bootstrap/esm/Button"

const OrderItem = ({ data: { key, text, order, setOrder } }) => {
  const [orderKey, orderDirection] = order.split("_")
  const isOrderedByItem = orderKey === key
  const direction = orderDirection || "desc"
  const newDirection = isOrderedByItem && orderDirection === "desc" ? "asc" : "desc"

  const handleClick = () => setOrder(`${key}_${newDirection}`)

  return (
    <Button variant="outline-primary" className="px-1 py-0" active={isOrderedByItem} onClick={handleClick}>
      {isOrderedByItem &&
        (direction === "asc" ? (
          <FaSortAmountDownAlt className="order-icon" />
        ) : (
          <FaSortAmountDown className="order-icon" />
        ))}
      {` ${text}`}
    </Button>
  )
}

export default OrderItem
