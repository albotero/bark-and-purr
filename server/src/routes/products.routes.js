import express from "express"
import { getProduct, getProducts, getRating, getReviews } from "../controllers/products.controllers.js"

const router = express.Router()

router.get("/product/:id/rating", getRating)
router.get("/product/:id/reviews", getReviews)
router.get("/product/:id", getProduct)
router.get("/products", getProducts)

export default router
