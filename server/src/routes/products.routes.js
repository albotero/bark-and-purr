import express from "express"
import { getProduct, getProducts } from "../controllers/products.controllers.js"

const router = express.Router()

router.get("/product/:id", getProduct)
router.get("/products", getProducts)

export default router
