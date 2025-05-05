import pg from "pg"
import envs from "../envs.js"

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = envs

export default new pg.Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  allowExitOnIdle: true,
})
