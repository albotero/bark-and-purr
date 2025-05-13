import express from "express";
import {
  getPublications,
  createPublicationController,
  updatePublicationController,
  deletePublication,
  getPublicationByIdController,
} from "../controllers/publications.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getPublications);
router.get("/product/:id", verifyToken, getPublicationByIdController);
router.post("/", verifyToken, createPublicationController);
router.put("/:id", verifyToken, updatePublicationController);
router.delete("/:id", verifyToken, deletePublication);


export default router;
