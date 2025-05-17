import express from "express"
import { register, login } from "../controllers/auth.controllers.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { getUserProfile, updateUserProfile, updateAvatar } from "../controllers/auth.controllers.js"
import upload from "../middlewares/upload.js"


const router = express.Router()

// Rutas públicas
router.post("/register", register)
router.post("/login", login)


// Rutas protegidas
router.get("/profile", verifyToken, getUserProfile); 
router.put("/profile", verifyToken, updateUserProfile);
router.put("/profile/avatar", verifyToken, upload.single("avatar"), updateAvatar)

export default router
