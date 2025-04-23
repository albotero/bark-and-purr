import express from "express"
import cors from "cors"
import envs from "./config/envs.js"

const whiteList = [envs.SERVER_URL, envs.CLIENT_URL]
const port = envs.PORT || 3000

const app = express()

app.use(
  cors({
    origin: (origin, callback) =>
      !origin || whiteList.includes(origin)
        ? callback(null, true)
        : callback(new Error(`CORS Error: ${origin}`), false),
  })
)
app.use(express.json())

app.listen(port, () => console.log(`Listening on Port ${port}`))
