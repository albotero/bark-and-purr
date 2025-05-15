import execute from "./execute.js";
import {
  createFavorite,
  getFavoritesByUser,
  deleteFavorite,
} from "../models/favorites.models.js";

// POST /favorites
export const postFavorite = (req, res) =>
  execute({
    res,
    success: 201,
    callback: createFavorite,
    args: { userId: req.user.id, productId: req.body.product_id }, 
  });

// GET /favorites/user
export const getFavorites = (req, res) =>
  execute({
    res,
    success: 200,
    callback: getFavoritesByUser,
    args: { userId: req.user.id },
  });

// DELETE /favorites/:id
export const removeFavorite = (req, res) =>
  execute({
    res,
    success: 200,
    callback: deleteFavorite,
    args: { favoriteId: req.params.id },
  });
