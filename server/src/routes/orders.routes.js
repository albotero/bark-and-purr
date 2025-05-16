import express from "express"
import { getMyOrders } from "../controllers/orders.controllers.js"
import { verifyToken } from "../middlewares/verifyToken.js"

const router = express.Router()

router.get("/", verifyToken, getMyOrders)

export default router
