import execute from "./execute.js"
import { createFavorite, getFavoritesByUser, deleteFavorite } from "../models/favorites.models.js"

// POST /favorites
export const postFavorite = (req, res) => {
  const { product_id } = req.body
  if (!product_id) {
    return res.status(400).json({ error: "product_id is required" })
  }
  return execute({
    res,
    success: 201,
    callback: createFavorite,
    args: { userId: req.user.id, productId: product_id },
  })
}

// GET /favorites
export const getFavorites = (req, res) =>
  execute({
    res,
    success: 200,
    callback: getFavoritesByUser,
    args: { userId: req.user.id, lang: req.params.lang },
  })

// DELETE /favorites/:id
export const removeFavorite = (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "Favorite ID is required" })
  }

  return execute({
    res,
    success: 204,
    callback: deleteFavorite,
    args: { favoriteId: id, userId: req.user.id },
  })
}
