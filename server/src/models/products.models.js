import executeQuery from "./executeQuery.js"

export const findProduct = async ({ id }) => {
  const rows = await executeQuery({
    text: "SELECT * FROM products WHERE id=$1",
    values: [id],
  })
  return rows[0] || {}
}

export const findProducts = async () => {
  /* Pagination and Limits.... */

  return await executeQuery({
    text: "SELECT * FROM products",
    values: [],
  })
}
