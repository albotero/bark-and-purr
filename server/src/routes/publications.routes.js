import express from "express";
import {
  createPublicationController,
  getPublications,
  getPublicationByIdController,
  updatePublicationController,
  deletePublication,
  togglePublicationStatus,
} from "../controllers/publications.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", verifyToken, getPublications);
router.get("/product/:id", verifyToken, getPublicationByIdController);
router.post(
  "/create",
  verifyToken,
  upload.array("images"),
  createPublicationController
);
router.put(
  "/:id",
  verifyToken,
  upload.array("files"),
  updatePublicationController
);
router.put("/:id/status", verifyToken, togglePublicationStatus);

router.delete("/:id", verifyToken, deletePublication);

export default router;
