import format from "pg-format"
import executeQuery from "./executeQuery.js"

export const findRating = async ({ productId }) => {
  const query = format("SELECT AVG(rating) AS rating FROM reviews WHERE product_id=%s", productId)
  const rows = await executeQuery(query)
  return rows[0]
}

/**
 *
 * @param {productId, rating, results_per_page}
 * @returns A list of the reviews of a specific product that match the filters
 */
export const findReviews = async ({ productId, rating, results_per_page: resultsPerPage = 20, page = 1 }) => {
  /* Pagination and Limits.... */
  const offset = (page - 1) * resultsPerPage
  const filters = []
  const values = []
  const addFilter = (column, operator, value) => {
    filters.push(`${column}${operator}%s`)
    values.push(value)
  }

  // Add product filter
  addFilter("product_id", "=", productId)

  const countReviews = await executeQuery(
    "SELECT rating, COUNT(id)::INT FROM reviews" +
      // Add filter
      format(` WHERE ${filters.join(" AND ")}`, ...values) +
      // Count by ratings
      " GROUP BY rating"
  )

  // Add requested filters
  if (rating) addFilter("rating", "=", rating)

  const totalReviews = countReviews.reduce((acc, { count }) => acc + count, 0)

  const reviews = await executeQuery(
    `SELECT r.*, u.surname
      FROM reviews r
      JOIN users u ON r.user_id = u.id` +
      // Add filter
      format(` WHERE ${filters.join(" AND ")}`, ...values) +
      // Add order
      " ORDER BY created_at DESC" +
      // Add pagination
      format(` LIMIT %s OFFSET %s`, resultsPerPage, offset)
  )

  const results = reviews.map(({ id, surname: user, rating, created_at: date, body }) => {
    return { id, user, date, rating, body }
  })

  const queryFilters = []
  if (rating) queryFilters.push({ key: "rating", value: rating })

  return {
    total_reviews: totalReviews,
    filters: queryFilters,
    results,
    ratings: countReviews,
    product: `/api/product/${productId}`,
  }
}
