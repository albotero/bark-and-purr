import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/", verifyToken, addToCart);
router.put("/:itemId", verifyToken, updateCartItem);
router.delete("/:itemId", verifyToken, deleteCartItem);

export default router;
