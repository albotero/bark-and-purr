import format from "pg-format"
import executeQuery from "./executeQuery.js"

export const findProduct = async ({ id }) => {
  const query = format("SELECT * FROM products WHERE id=%s", id)
  const rows = await executeQuery(query)
  return rows[0] || {}
}

/**
 *
 * @param {min_stock, min_price, max_price, order_by, page, results_per_page}
 * @returns A list of the products that match the filters, with order and pagination
 *
 * order_by: ${column}_${asc||desc}
 */
export const findProducts = async ({
  min_stock: minStock,
  min_price: minPrice,
  max_price: maxPrice,
  order_by: orderBy = "price_desc",
  page = 1,
  results_per_page: resultsPerPage = 10,
}) => {
  /* Pagination and Limits.... */
  const offset = (page - 1) * resultsPerPage
  const filters = []
  const values = []
  const addFilter = (column, operator, value) => {
    filters.push(`${column} ${operator} '%s'`)
    values.push(value)
  }

  // Add requested filters
  if (minStock) addFilter("stock", ">=", minStock)
  if (minPrice) addFilter("price", ">=", minPrice)
  if (maxPrice) addFilter("price", "<=", maxPrice)

  // Build query
  const [orderColumn, orderDirection] = orderBy.split("_")
  const query =
    "SELECT * FROM products" +
    // Add filter
    (filters.length ? format(` WHERE ${filters.join(" AND ")}`, ...values) : "") +
    // Add order
    (orderBy ? format(` ORDER BY %s %s`, orderColumn, orderDirection.toUpperCase()) : "") +
    // Add pagination
    format(` LIMIT %s OFFSET %s`, resultsPerPage, offset)

  console.log(query)

  return await executeQuery(query)
}
