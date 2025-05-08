import express from "express"
import { register, login } from "../controllers/auth.controllers.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { getUserProfile, updateUserProfile } from "../controllers/auth.controllers.js"

const router = express.Router()

// Rutas públicas
router.post("/register", register)
router.post("/login", login)


// Rutas protegidas
router.get("/profile", verifyToken, getUserProfile); 
router.put("/profile", verifyToken, updateUserProfile);

export default router
