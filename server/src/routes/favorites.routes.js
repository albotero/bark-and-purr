import { Router } from "express";
import { addFavorite, getFavoritesByUser, deleteFavorite } from "../controllers/favorites.controllers.js";
import { validateFavorite } from "../middlewares/validateFavorite.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router()

router.post('/', authenticate, validateFavorite, addFavorite);
router.get('/user/:user_id', authenticate, getFavoritesByUser);
router.delete('/:id', authenticate, deleteFavorite);

export default router