import { Router } from "express";
import multer from "multer";
import { updateAvatarController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { validateImage } from "../middlewares/validateImage.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put(
  "/:id/avatar",
  authenticate,
  upload.single("avatar"),
  validateImage,
  updateAvatarController
);

export default router;
