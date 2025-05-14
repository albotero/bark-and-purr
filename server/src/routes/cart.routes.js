import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  startPayment,
  completePayment,
  rejectPayment,
  cancelCart,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Routes for cart status management (must come first)
router.put("/start-payment", verifyToken, startPayment);
router.put("/complete-payment", verifyToken, completePayment);
router.put("/reject-payment", verifyToken, rejectPayment);
router.put("/cancel", verifyToken, cancelCart);

// Routes for cart actions
router.get("/", verifyToken, getCart);
router.post("/", verifyToken, addToCart);
router.put("/:itemId", verifyToken, updateCartItem);
router.delete("/:itemId", verifyToken, deleteCartItem);

export default router;
