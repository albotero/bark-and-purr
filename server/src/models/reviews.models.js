import format from "pg-format"
import executeQuery from "./executeQuery.js"

export const findRating = async ({ productId }) => {
  const query = format("SELECT AVG(rating) AS rating FROM reviews WHERE product_id=%s", productId)
  const rows = await executeQuery(query)
  return rows[0]
}

const prepareHATEOAS = ({ productId, totalReviews, reviews, filters, orderBy, resultsPerPage, page }) => {
  const currentPage = Number(page)
  const totalPages = Math.ceil(totalReviews / resultsPerPage)

  const queryFilters = []
  if (filters.rating) queryFilters.push({ key: "rating", value: filters.rating })
  if (filters.minDate) queryFilters.push({ key: "min_date", value: filters.minDate })
  if (filters.maxDate) queryFilters.push({ key: "max_date", value: filters.maxDate })

  const prepareReviewsUrl = (r) => {
    // Only send page links if are valid pages and different to current one
    if (r < 1 || r > totalPages || r == currentPage) return
    // Prepare GET link with params
    const params = [
      ...queryFilters.map(({ key, value }) => `${key}=${value}`),
      `order_by=${orderBy}`,
      `results_per_page=${resultsPerPage}`,
      `page=${r}`,
    ]
    // Build URL
    return `/api/products/${productId}/reviews?${params.join("&")}`
  }
  const results = reviews.map(({ id, surname: user, rating, created_at: date, body }) => {
    return { id, user, date, rating, body }
  })
  const firstPage = prepareReviewsUrl(1)
  const lastPage = prepareReviewsUrl(totalPages)
  const prevPage = prepareReviewsUrl(currentPage - 1)
  const nextPage = prepareReviewsUrl(currentPage + 1)

  return {
    total_reviews: totalReviews,
    order_by: orderBy,
    filters: queryFilters,
    results,
    product: `/api/products/${productId}`,
    pages: {
      page: currentPage,
      total: totalPages,
      first: firstPage,
      prev: prevPage,
      next: nextPage,
      last: lastPage,
    },
  }
}

/**
 *
 * @param {productId, rating, min_date, max_date, order_by, page, results_per_page}
 * @returns A list of the reviews of a specific product that match the filters, with order and pagination
 *
 * order_by: ${column}_${asc|desc}
 */
export const findReviews = async ({
  productId,
  rating,
  min_date: minDate,
  max_date: maxDate,
  order_by: orderBy = "date_desc",
  results_per_page: resultsPerPage = 10,
  page = 1,
}) => {
  /* Pagination and Limits.... */
  const offset = (page - 1) * resultsPerPage
  const filters = []
  const values = []
  const addFilter = (column, operator, value) => {
    filters.push(`${column}${operator}%s`)
    values.push(value)
  }

  // Add requested filters
  addFilter("product_id", "=", productId)
  if (rating) addFilter("rating", "=", rating)
  if (minDate) addFilter("created_at", ">=", minDate)
  if (maxDate) addFilter("created_at", "<=", maxDate)

  const countReviews = await executeQuery(
    "SELECT COUNT(id) FROM reviews" +
      // Add filter
      format(` WHERE ${filters.join(" AND ")}`, ...values)
  )
  const totalReviews = Number(countReviews[0]?.count || 0)

  // Build query
  const [orderColumn, orderDirection] = orderBy.split("_").map((el) => el.replace("date", "created_at"))

  const reviews = await executeQuery(
    `SELECT r.*, u.surname
      FROM reviews r
      JOIN users u ON r.user_id = u.id` +
      // Add filter
      format(` WHERE ${filters.join(" AND ")}`, ...values) +
      // Add order
      (orderBy ? format(` ORDER BY %s %s`, orderColumn, orderDirection.toUpperCase()) : "") +
      // Add pagination
      format(` LIMIT %s OFFSET %s`, resultsPerPage, offset)
  )

  return prepareHATEOAS({
    productId,
    totalReviews,
    reviews,
    filters: { rating, minDate, maxDate },
    orderBy,
    resultsPerPage,
    page,
  })
}
