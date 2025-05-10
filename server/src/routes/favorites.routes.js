import { Router } from "express";
import {
  addFavoriteController,
  getFavoritesByUserController,
  deleteFavoriteController,
} from "../controllers/favorites.controllers.js";
import { validateFavorite } from "../middlewares/validateFavorite.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/", authenticate, validateFavorite, addFavoriteController);
router.get("/user/:user_id", authenticate, getFavoritesByUserController);
router.delete("/:id", authenticate, deleteFavoriteController);

export default router;
