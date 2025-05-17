import execute from "./execute.js"
import { findProduct, findProducts } from "../models/products.models.js"
import { findRating, findReviews } from "../models/reviews.models.js"

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
    args: { ...req.params, ...req.query },
  })

export const getRating = (req, res) =>
  execute({
    res,
    success: 200,
    callback: findRating,
    args: { productId: req.params.id },
  })

export const getReviews = (req, res) =>
  execute({
    res,
    success: 200,
    callback: findReviews,
    args: { productId: req.params.id, lang: req.params.lang, ...req.query },
  })
