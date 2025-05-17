import pool from "../../config/db/connection.db.js"

const executeQuery = async (query) => {
  const result = await pool.query(query)
  return result.rows
}

export default executeQuery
