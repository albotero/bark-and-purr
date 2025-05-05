import pool from "../../config/db/connection.db.js"

const executeQuery = async (sqlQuery) => (await pool.query(sqlQuery)).rows

export default executeQuery
