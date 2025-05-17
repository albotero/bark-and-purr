import { Router } from "express"
import { postFavorite, getFavorites, removeFavorite } from "../controllers/favorites.controllers.js"
import { validateFavorite } from "../middlewares/validateFavorite.js"
import { verifyToken } from "../middlewares/verifyToken.js"

const router = Router()

router.post("/", verifyToken, validateFavorite, postFavorite)
router.get("/:lang", verifyToken, getFavorites)
router.delete("/:id", verifyToken, removeFavorite)

export default router
