import { Router } from "express";
import { postFavorite, getFavorites, removeFavorite } from "../controllers/favorites.controllers.js";
import { validateFavorite } from "../middlewares/validateFavorite.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/", authenticate, validateFavorite, postFavorite);
router.get("/user", authenticate, getFavorites);
router.delete("/:id", authenticate, removeFavorite);

export default router;
