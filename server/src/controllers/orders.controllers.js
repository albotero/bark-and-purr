import { getOrdersByUserId, countOrdersByUserId } from "../models/orders.models.js"

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id
    const { status, page = 1, limit = 10 } = req.query
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const offset = (pageNum - 1) * limitNum

    const [orders, totalCount] = await Promise.all([
      getOrdersByUserId(userId, status, limitNum, offset),
      countOrdersByUserId(userId, status),
    ])

    const totalPages = Math.ceil(totalCount / limitNum)

    res.json({
      page: pageNum,
      totalPages,
      totalCount,
      orders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ message: "Error retrieving orders" })
  }
}
