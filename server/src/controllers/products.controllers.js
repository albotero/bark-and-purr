import execute from "./execute.js"
import { findProducts } from "../models/products.models.js"

export const getProducts = (req, res) =>
  execute({
    res,
    success: 200,
    callback: findProducts,
    args: req.body,
  })
