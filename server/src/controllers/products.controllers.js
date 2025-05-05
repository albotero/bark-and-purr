import execute from "./execute.js"
import { findProduct, findProducts } from "../models/products.models.js"

export const getProduct = (req, res) =>
  execute({
    res,
    success: 200,
    callback: findProduct,
    args: req.params,
  })

export const getProducts = (req, res) =>
  execute({
    res,
    success: 200,
    callback: findProducts,
    args: req.query,
  })
