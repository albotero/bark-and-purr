import {
  findCartItemsByUser,
  findCartItem,
  insertCartItem,
  updateCartItemQuantity,
  updateCartItem as updateCartItemModel,
  deleteCartItem as deleteCartItemModel,
} from "../models/cart.models.js";
import execute from "../controllers/execute.js";

export const getCart = async (req, res) => {
  const userId = req.user.id;
  await execute({
    res,
    success: 200,
    callback: findCartItemsByUser,
    args: userId,
  });
};

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  const existing = await findCartItem(userId, product_id);

  await execute({
    res,
    success: 201,
    callback: async () => {
      if (existing) {
        await updateCartItemQuantity(quantity, existing.id);
      } else {
        await insertCartItem(userId, product_id, quantity);
      }
      return { message: "Producto agregado al carrito" };
    },
    args: null,
  });
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
        return { status: 404, message: "Item no encontrado o no autorizado" };
      }

      return { message: "Cantidad actualizada" };
    },
    args: null,
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
        return { status: 404, message: "Item no encontrado o no autorizado" };
      }

      return { message: "Producto eliminado del carrito" };
    },
    args: null,
  });
};
