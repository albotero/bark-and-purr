import {
  findCartItemsByUser,
  findCartItem,
  insertCartItem,
  updateCartItemQuantity,
  updateCartItem as updateCartItemModel,
  deleteCartItem as deleteCartItemModel,
  getActiveCart,
  updateCartStatus,
} from "../models/cart.models.js";
import execute from "../controllers/execute.js";

export const getCart = async (req, res) => {
  const userId = req.user.id;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const items = await findCartItemsByUser(userId);
      return { cart: items };
    },
  });
};


export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Valid Product ID and quantity are required" });
  }

  const existing = await findCartItem(userId, product_id);

  if (existing) {
    await updateCartItemQuantity(existing.quantity + quantity, existing.id);
  } else {
    // ✅ El modelo ya se encarga de obtener el precio
    await insertCartItem(userId, product_id, quantity);
  }

  const updatedCart = await findCartItemsByUser(userId);
  return res
    .status(201)
    .json({ message: "Product added to cart", cart: updatedCart });
};


export const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;
  const { quantity } = req.body;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const result = await updateCartItemModel(quantity, itemId, userId);

      if (result.rowCount === 0) {
        return { status: 404, message: "Item not found or unauthorized" };
      }

      return { message: "Updated quantity" };
    },
  });
};


export const deleteCartItem = async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const result = await deleteCartItemModel(itemId, userId);

      if (result.rowCount === 0) {
        return { status: 404, message: "Item not found or unauthorized" };
      }

      return { message: "Product removed from cart" };
    },
  });
};


export const startPayment = async (req, res) => {
  const userId = req.user.id;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const cart = await getActiveCart(userId);
      if (!cart) return { status: 404, message: "There is no active cart" };

      await updateCartStatus(cart.id, "payment_pending");
      return { message: "Continue with the payment process" };
    },
  });
};


export const completePayment = async (req, res) => {
  const userId = req.user.id;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const cart = await getActiveCart(userId);
      if (!cart) return { status: 404, message: "There is no active cart" };

      await updateCartStatus(cart.id, "paid");
      return { message: "Payment completed" };
    },
  });
};


export const rejectPayment = async (req, res) => {
  const userId = req.user.id;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const cart = await getActiveCart(userId);
      if (!cart) return { status: 404, message: "There is no active cart" };

      await updateCartStatus(cart.id, "payment_rejected");
      return { message: "Rejected payment" };
    },
  });
};


export const cancelCart = async (req, res) => {
  const userId = req.user.id;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const cart = await getActiveCart(userId);
      if (!cart) return { status: 404, message: "There is no active cart" };

      await updateCartStatus(cart.id, "canceled");
      return { message: "Canceled cart" };
    },
  });
};
