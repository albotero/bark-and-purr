import { useTheme } from "../context/ThemeContext"
import { useTranslation } from "react-i18next"

const OrderStatusBadge = ({ status }) => {
  const { theme } = useTheme()
  const { t } = useTranslation("orders")

  const getStyle = () => {
    const dark = theme === "dark"

    const styles = {
      paid: dark ? "bg-success text-white" : "bg-success-subtle text-success",
      payment_pending: dark ? "bg-warning text-dark" : "bg-warning-subtle text-warning",
      payment_rejected: dark ? "bg-danger text-white" : "bg-danger-subtle text-danger",
      canceled: dark ? "bg-secondary text-white" : "bg-secondary-subtle text-secondary",
      active: dark ? "bg-primary text-white" : "bg-primary-subtle text-primary",
      default: dark ? "bg-dark text-white" : "bg-light-subtle text-light"
    }

    return styles[status] || (dark ? "bg-dark text-white" : "bg-light text-dark")
  }

  return (
    <span className={`badge rounded-pill ${getStyle()}`}>
      {t(status)}
    </span>
  )
}
export default OrderStatusBadge
