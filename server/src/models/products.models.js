import format from "pg-format"
import executeQuery from "./executeQuery.js"

export const findProduct = async ({ id }) => {
  const query = format("SELECT * FROM products WHERE id=%s", id)
  const rows = await executeQuery(query)
  return rows[0] || {}
}

const prepareHATEOAS = ({ totalProducts, products, filters, orderBy, resultsPerPage, page }) => {
  const currentPage = Number(page)
  const totalPages = Math.ceil(totalProducts / resultsPerPage)

  const queryFilters = []
  if (filters.minPrice) queryFilters.push({ key: "min_price", value: filters.minPrice })
  if (filters.maxPrice) queryFilters.push({ key: "max_price", value: filters.maxPrice })
  if (filters.minStock) queryFilters.push({ key: "min_stock", value: filters.minStock })

  const prepareProductsUrl = (p) => {
    // Only send page links if are valid pages and different to current one
    if (p < 1 || p > totalPages || p == currentPage) return
    // Prepare GET link with params
    const params = [
      ...queryFilters.map(({ key, value }) => `${key}=${value}`),
      `order_by=${orderBy}`,
      `results_per_page=${resultsPerPage}`,
      `page=${p}`,
    ]
    // Build URL
    return "/api/products?" + params.join("&")
  }
  const results = products.map(({ id, title, price }) => ({
    title,
    price,
    link: `/api/product/${id}`,
  }))
  const firstPage = prepareProductsUrl(1)
  const lastPage = prepareProductsUrl(totalPages)
  const prevPage = prepareProductsUrl(currentPage - 1)
  const nextPage = prepareProductsUrl(currentPage + 1)

  return {
    total_products: totalProducts,
    orderBy,
    filters: queryFilters,
    results,
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
 * @param {min_stock, min_price, max_price, order_by, page, results_per_page}
 * @returns A list of the products that match the filters, with order and pagination
 *
 * order_by: ${column}_${asc|desc}
 */
export const findProducts = async ({
  min_stock: minStock,
  min_price: minPrice,
  max_price: maxPrice,
  order_by: orderBy = "price_desc",
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
  if (minStock) addFilter("stock", ">=", minStock)
  if (minPrice) addFilter("price", ">=", minPrice)
  if (maxPrice) addFilter("price", "<=", maxPrice)

  // Build query
  const [orderColumn, orderDirection] = orderBy.split("_")
  let query =
    "SELECT * FROM products" +
    // Add filter
    (filters.length ? format(` WHERE ${filters.join(" AND ")}`, ...values) : "")

  const totalProducts = await executeQuery(query)

  query +=
    // Add order
    (orderBy ? format(` ORDER BY %s %s`, orderColumn, orderDirection.toUpperCase()) : "") +
    // Add pagination
    format(` LIMIT %s OFFSET %s`, resultsPerPage, offset)

  const products = await executeQuery(query)
  return prepareHATEOAS({
    totalProducts: totalProducts.length,
    products,
    filters: { minPrice, maxPrice, minStock },
    orderBy,
    resultsPerPage,
    page,
  })
}
