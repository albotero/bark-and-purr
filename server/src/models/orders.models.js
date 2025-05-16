import db from "../../config/db/connection.db.js"

export const getOrdersByUserId = async (userId, statusFilter, limit, offset) => {
    const values = [userId]
    let i = 2

    let whereClause = `
    WHERE c.user_id = $1
    AND c.status IN ('paid', 'active', 'canceled', 'payment_pending', 'payment_rejected')
    `

    if (statusFilter) {
        whereClause += ` AND c.status = $${i++}`
        values.push(statusFilter)
    }

    const query = `
    SELECT
        c.id AS cart_id,
        c.status,
        c.status_time,
        json_agg(
        json_build_object(
            'id', p.id,
            'title', p.title,
            'price', p.price,
            'quantity', pc.quantity,
            'image', (
            SELECT pi.url
            FROM product_images pi
            WHERE pi.product_id = p.id
            ORDER BY pi.id ASC
            LIMIT 1
                )
            )
        ) AS products
    FROM carts c
    JOIN products_by_cart pc ON pc.cart_id = c.id
    JOIN products p ON p.id = pc.product_id
    ${whereClause}
    GROUP BY c.id
    ORDER BY c.status_time DESC
    LIMIT $${i++}
    OFFSET $${i}
    `

    values.push(limit, offset)
    const result = await db.query(query, values)
    return result.rows
}

export const countOrdersByUserId = async (userId, statusFilter) => {
    const values = [userId]
    let i = 2

    let whereClause = `
    WHERE c.user_id = $1
    AND c.status IN ('paid', 'active', 'canceled', 'payment_pending', 'payment_rejected')
    `

    if (statusFilter) {
        whereClause += ` AND c.status = $${i++}`
        values.push(statusFilter)
    }

    const query = `SELECT COUNT(DISTINCT c.id) AS total FROM carts c ${whereClause}`
    const result = await db.query(query, values)
    return parseInt(result.rows[0].total, 10)
}
