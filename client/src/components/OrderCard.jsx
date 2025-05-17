import { useState } from "react"
import { useTranslation } from "react-i18next"

const OrderCard = ({ order }) => {
    const { t } = useTranslation("orders")
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setOpen(!open)

    const total = order.products.reduce((sum, p) => sum + p.price * p.quantity, 0)

    return (
        <div className="border rounded-2xl p-4 shadow-sm mb-4 bg-white">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">{t("card.title", { id: order.id })}</p>
                    <p>{t("items", { count: order.products.length, total: total.toLocaleString() })}</p>
                </div>
                <button onClick={toggleOpen} className="text-sm text-brown-700 underline">
                    {open ? t("card.hide_details") : t("card.show_details")}
                </button>
            </div>

            {open && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.products.map((product, i) => (
                        <div key={i} className="flex items-center border rounded-lg p-2">
                            <img src={product.image} alt={product.name} className="w-16 h-16 object-contain mr-4" />
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">{t("quantity")}: {product.quantity}</p>
                                <p className="text-sm text-gray-600">{t("unit_price")}: ${product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrderCard
