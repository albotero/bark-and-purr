import {
  findCartItemsByUser,
  findCartItem,
  insertCartItem,
  updateCartItemQuantity,
  updateCartItem as updateCartItemModel,
  deleteCartItem as deleteCartItemModel,
  createCart,
  getActiveCart,
  updateCartStatus,
} from "../models/cart.models.js";
import execute from "../controllers/execute.js";

// Get the user's active cart
export const getCart = async (req, res) => {
  const userId = req.user.id;
  await execute({
    res,
    success: 200,
    callback: async () => {
      const cart = await getActiveCart(userId);
      if (cart) {
        const cartItems = await findCartItemsByUser(userId);
        return { cart, cartItems };
      } else {
        // If there is no active cart, we create it
        const newCart = await createCart(userId);
        return { cart: newCart, cartItems: [] };
      }
    },
    args: userId,
  });
};

// Add product to cart
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  const existing = await findCartItem(userId, product_id);
  await execute({
    res,
    success: 201,
    callback: async () => {
      const cart = await getActiveCart(userId); // We verify that the cart is active
      if (!cart) {
        const newCart = await createCart(userId);
        return { message: "Cart created. Add products." };
      }

      if (existing) {
        await updateCartItemQuantity(quantity, existing.id);
        return { message: "Quantity updated in cart" };
      } else {
        await insertCartItem(userId, product_id, quantity);
        return { message: "Product added to cart" };
      }
    },
    args: null,
  });
};

// Update the quantity of a product in the cart
export const updateCartItem = async (req, res) => {
  const userId = req.user.id; // The user ID from the token
  const itemId = req.params.itemId; // The ID of the item to be updated
  const { quantity } = req.body; // The amount to update

  //Execute the update logic
  await execute({
    res,
    success: 200,
    callback: async () => {
      const result = await updateCartItemModel(quantity, itemId, userId); 
      if (result.rowCount === 0) {
        return { status: 404, message: "Item not found or unauthorized" }; 
      }
      return { message: "Successful update" }; 
    },
    args: null,
  });
};



// Remove a product from the cart
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
    args: null,
  });
};

// Change the cart status to "payment_pending"
export const startPayment = async (req, res) => {
  const userId = req.user.id;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const cart = await getActiveCart(userId);
      if (!cart) {
        return { status: 404, message: "There is no active cart" };
      }

      await updateCartStatus(cart.id, "payment_pending");
      return {
        message: "Continue with the payment process.",
      };
    },
    args: null,
  });
};

// Change the cart status to "paid"
export const completePayment = async (req, res) => {
  const userId = req.user.id;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const cart = await getActiveCart(userId);
      if (!cart) {
        return { status: 404, message: "There is no active cart" };
      }

      await updateCartStatus(cart.id, "paid");
      return { message: "Payment completed." };
    },
    args: null,
  });
};

//Change the cart status to "payment_rejected"
export const rejectPayment = async (req, res) => {
  const userId = req.user.id;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const cart = await getActiveCart(userId);
      if (!cart) {
        return { status: 404, message: "There is no active cart" };
      }

      await updateCartStatus(cart.id, "payment_rejected");
      return {
        message: "Payment rejected.",
      };
    },
    args: null,
  });
};

// Change the cart status to "canceled"
export const cancelCart = async (req, res) => {
  const userId = req.user.id;

  await execute({
    res,
    success: 200,
    callback: async () => {
      const cart = await getActiveCart(userId);
      if (!cart) {
        return { status: 404, message: "There is no active cart" };
      }

      await updateCartStatus(cart.id, "canceled");
      return { message: "Cart canceled." };
    },
    args: null,
  });
};
