import format from "pg-format"
import executeQuery from "./executeQuery.js"
import { doTranslation } from "../common/translate.js"

export const findProduct = async ({ id, lang }) => {
  const query = format(
    `SELECT
        p.*,
        CONCAT(u.surname, ' ', u.last_name) AS vendor,
        ARRAY (
          SELECT imgs.url
          FROM product_images imgs
          WHERE imgs.product_id = p.id
          ORDER BY imgs.id
        ) AS images
      FROM products p
      JOIN users u ON p.vendor_id = u.id
      WHERE p.id = %s`,
    id
  )
  const rows = await executeQuery(query)
  const product = !rows || rows.length === 0 ? { message: "not_found" } : rows[0]
  if (!product) return

  const translate = async (text) => {
    const { translated, translation, sourceLang, targetLang } = await doTranslation("auto", lang, text)
    return {
      content: translated ? translation : text,
      translated,
      sourceLang,
      targetLang,
    }
  }

  return {
    ...product,
    title: await translate(product.title),
    description: await translate(product.description),
  }
}

const prepareHATEOAS = async ({ totalProducts, lang, products, histogram, filters, orderBy, resultsPerPage, page }) => {
  const currentPage = Number(page)
  const totalPages = Math.ceil(totalProducts / resultsPerPage)

  const queryFilters = []
  if (filters.search) queryFilters.push({ key: "search", value: filters.search })
  if (filters.minPrice) queryFilters.push({ key: "min_price", value: filters.minPrice })
  if (filters.maxPrice) queryFilters.push({ key: "max_price", value: filters.maxPrice })
  if (filters.minStock) queryFilters.push({ key: "min_stock", value: filters.minStock })

  const prepareProductsUrl = (p) => {
    // Only send page links if are valid pages
    if (p < 1 || (p > totalPages && p !== currentPage)) return
    // Prepare GET link with params
    const params = [
      ...queryFilters.map(({ key, value }) => `${key}=${value}`),
      `order_by=${orderBy}`,
      `results_per_page=${resultsPerPage}`,
      `page=${p}`,
    ]
    // Build URL
    return `/api/products/${lang}?${params.join("&")}`
  }
  const results = await Promise.all(
    products.map(async ({ id, title, price, thumbnail, rating }) => {
      const { translated, translation, sourceLang, targetLang } = await doTranslation("auto", lang, title)
      return {
        id,
        title: {
          content: translated ? translation : title,
          translated,
          sourceLang,
          targetLang,
        },
        price,
        rating,
        thumbnail,
        link: `/api/product/${lang}/${id}`,
      }
    })
  )
  const thisPage = prepareProductsUrl(currentPage)
  const firstPage = currentPage > 1 ? prepareProductsUrl(1) : undefined
  const lastPage = currentPage < totalPages ? prepareProductsUrl(totalPages) : undefined
  const prevPage = currentPage - 1 > 1 ? prepareProductsUrl(currentPage - 1) : undefined
  const nextPage = currentPage + 1 < totalPages ? prepareProductsUrl(currentPage + 1) : undefined

  return {
    total_products: totalProducts,
    order_by: orderBy,
    filters: queryFilters,
    results,
    histogram,
    pages: {
      results_per_page: resultsPerPage,
      page: currentPage,
      total: totalPages,
      this: thisPage,
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
  lang,
  search,
  min_stock: minStock,
  min_price: minPrice,
  max_price: maxPrice,
  order_by: orderBy = "rating_desc",
  results_per_page: rpp = 10,
  page = 1,
}) => {
  /* Pagination and Limits.... */
  const resultsPerPage = Number(rpp)
  const offset = (page - 1) * resultsPerPage
  const filters = []
  const histogramFilters = []
  const values = []
  const histogramValues = []
  let i = 0
  let histogramI = 0

  const addFilter = (column, operator, value) => {
    i++
    filters.push(
      column === "title" // For text search
        ? `UNACCENT(LOWER(${column})) SIMILAR TO '%' || UNACCENT(LOWER($${i})) || '%'`
        : `${column} ${operator} $${i}`
    )
    values.push(value)
    if (column !== "price") {
      histogramI++
      histogramFilters.push(
        column === "title" // For text search
          ? `UNACCENT(LOWER(${column})) SIMILAR TO '%' || UNACCENT(LOWER($${histogramI})) || '%'`
          : `${column} ${operator} $${histogramI}`
      )
      histogramValues.push(value)
    }
  }

  // Add requested filters
  if (search) addFilter("title", undefined, search.trim().replace(/\s+/g, "|"))
  if (minStock) addFilter("stock", ">=", minStock)
  if (minPrice) addFilter("price", ">=", minPrice)
  if (maxPrice) addFilter("price", "<=", maxPrice)
  addFilter("is_active_product", "=", true)

  const countProducts = await executeQuery({
    text:
      "SELECT COUNT(id)::INT FROM products" +
      // Add filter
      (filters.length ? ` WHERE ${filters.join(" AND ")}` : ""),
    values,
  })
  const totalProducts = countProducts[0]?.count

  const order =
    orderBy == "random"
      ? " ORDER BY RANDOM ()"
      : /^(rating|price|date)_(asc|desc)$/.test(orderBy)
      ? ` ORDER BY ${orderBy.replace("_", " ")} NULLS LAST`
      : ""

  values.push(resultsPerPage)
  values.push(offset)

  // Build query
  const products = await executeQuery({
    text:
      `SELECT
        *,
        created_at AS date,
        (
          SELECT imgs.url
          FROM product_images imgs
          WHERE imgs.product_id = products.id
          ORDER BY imgs.id
          LIMIT 1
        ) AS thumbnail,
        (
          SELECT AVG(rating)
          FROM reviews
          WHERE reviews.product_id = products.id
        ) AS rating
      FROM products` +
      // Add filter
      (filters.length ? ` WHERE ${filters.join(" AND ")}` : "") +
      // Add order
      order +
      // Add pagination
      ` LIMIT $${i + 1} OFFSET $${i + 2}`,
    values,
  })

  // Build histogram
  const histogram = await executeQuery({
    text: `
    WITH
      stats AS (
        SELECT 
          CEIL(MAX(price) / 10) * 10 AS max_price,
          CEIL(MAX(price) / 100) * 10 AS range_size
        FROM products
        ${histogramFilters ? `WHERE ${histogramFilters.join(" AND ")}` : ""}
      ),
      series AS (
        SELECT GENERATE_SERIES(
          0, 
          (SELECT max_price::INT FROM stats), 
          (SELECT range_size::INT FROM stats)
        ) AS range_start
      ),
      ranges AS (
        SELECT 
          (range_start + 1) AS range_start, 
          (range_start + (SELECT range_size FROM stats)) AS range_end 
        FROM series
        WHERE range_start < (SELECT max_price FROM stats)
      ),
      values AS (
        SELECT
          range_start AS from,
          range_end AS to,
          (SELECT COUNT(*)::INT
            FROM products
            WHERE
              ${histogramFilters ? `${histogramFilters.join(" AND ")} AND` : ""}
              price BETWEEN range_start AND range_end
          )
        FROM ranges
      )
    SELECT
      MIN(price) AS min_price,
      MAX(price) AS max_price,
      (SELECT JSON_AGG(values.*) FROM values) AS values
    FROM products
      ${histogramFilters ? `WHERE ${histogramFilters.join(" AND ")}` : ""}
    `,
    values: histogramValues,
  })

  return await prepareHATEOAS({
    totalProducts,
    lang,
    products,
    histogram: histogram[0],
    filters: { search, minPrice, maxPrice, minStock },
    orderBy,
    resultsPerPage,
    page,
  })
}
