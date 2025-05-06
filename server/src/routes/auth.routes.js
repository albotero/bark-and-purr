import express from "express"
import { register, login } from "../controllers/auth.controllers.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { getUserProfile } from "../controllers/auth.controllers.js"

const router = express.Router()

// Rutas públicas
router.post("/register", register)
router.post("/login", login)


// Rutas protegidas
router.get("/profile", verifyToken, getUserProfile); 

export default router
