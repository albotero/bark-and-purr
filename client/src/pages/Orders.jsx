import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import OrderStatusBadge from "../components/OrderStatusBadge"
import { useUser } from "../context/UserContext"
import { useTranslation } from "react-i18next"

const Orders = () => {
  const { t } = useTranslation("orders")
  const { getToken } = useUser()
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(false)
  const [openCardId, setOpenCardId] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      const token = getToken()
      try {
        const params = new URLSearchParams({
          page,
          limit: 5,
          ...(statusFilter && { status: statusFilter }),
        })

        const response = await fetch(`http://localhost:3000/api/orders?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        setOrders(Array.isArray(data.orders) ? data.orders : [])
        setTotalPages(data.totalPages || 1)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [page, statusFilter, getToken])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  return (
    <div className="p-4 p-md-5 container">
      <h6 className="mb-4">
        <Link to="/user" className="text-decoration-none text-primary">
          {t("orders.back_profile", "orders.current")}
        </Link>{" "}
        &gt; <strong>{t("orders.current")}</strong>
      </h6>
      <h1 className="mb-4 fw-bold">{t("orders.title")}</h1>

      <div className="mb-4">
        <label className="form-label me-2">{t("orders.status_filter")}:</label>
        <select
          className="form-select w-auto d-inline-block"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="">{t("orders.all")}</option>
          <option value="paid">{t("orders.paid")}</option>
          <option value="active">{t("orders.active")}</option>
          <option value="payment_pending">{t("orders.payment_pending")}</option>
          <option value="payment_rejected">{t("orders.payment_rejected")}</option>
          <option value="canceled">{t("orders.canceled")}</option>
        </select>
      </div>

      {loading ? (
        <p>{t("orders.loading")}</p>
      ) : orders.length === 0 ? (
        <p>{t("orders.empty")}</p>
      ) : (
        orders.map((order) => {
          const total = order.products.reduce((sum, p) => sum + p.price * p.quantity, 0)
          const isOpen = openCardId === order.cart_id
          return (
            <div key={order.cart_id} className="border rounded-4 p-3 mb-4 shadow-sm bg-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1">
                    {t("orders.items", {
                      count: order.products.length,
                      total: total.toLocaleString(),
                    })}
                  </p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <button
                  onClick={() => setOpenCardId(isOpen ? null : order.cart_id)}
                  className="btn btn-sm btn-outline-primary"
                >
                  {isOpen ? t("orders.card.hide_details") : t("orders.card.show_details")}
                </button>
              </div>

              {isOpen && (
                <div className="mt-3 row row-cols-1 row-cols-md-2 g-3">
                  {order.products.map((product, i) => (
                    <div key={i} className="col">
                      <div className="d-flex align-items-center border rounded-3 p-2 bg-light-subtle">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="me-3"
                          style={{
                            width: "64px",
                            height: "64px",
                            objectFit: "contain",
                          }}
                        />
                        <div>
                          <p className="fw-medium mb-1">{product.title}</p>
                          <p className="mb-0 text-muted small">
                            {t("orders.quantity")}: {product.quantity}
                          </p>
                          <p className="mb-0 text-muted small">
                            {t("orders.price")}: ${product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}

      {/* Paginador */}
      <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
        <button className="btn btn-outline-secondary" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          {t("orders.prev")}
        </button>
        <span className="fw-bold">
          {t("orders.page")} {page} {t("orders.of")} {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          {t("orders.next")}
        </button>
      </div>
    </div>
  )
}

export default Orders
