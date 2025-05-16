import express from "express"
import { getProduct, getProducts, getRating, getReviews } from "../controllers/products.controllers.js"

const router = express.Router()

router.get("/product/:id/rating", getRating)
router.get("/product/:lang/:id/reviews", getReviews)
router.get("/product/:lang/:id", getProduct)
router.get("/products/:lang", getProducts)

export default router
