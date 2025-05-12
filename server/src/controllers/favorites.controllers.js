import execute from "./execute.js";
import {
  addFavorite,
  getFavoritesByUser,
  deleteFavorite,
} from "../models/favorites.models.js";

export const addFavoriteController = (req, res) =>
  execute({
    res,
    success: 201,
    callback: addFavorite,
    args: req.body,
  });

export const getFavoritesByUserController = (req, res) =>
  execute({
    res,
    success: 200,
    callback: getFavoritesByUser,
    args: { user_id: req.params.user_id },
  });

export const deleteFavoriteController = (req, res) =>
  execute({
    res,
    success: 200,
    callback: deleteFavorite,
    args: { id: req.params.id },
  });
