import pool from "../../config/db/connection.db.js";
import execute from "../controllers/execute.js";

export const findCartItemsByUser = async (userId) => {
  return await execute({
    success: 200,
    callback: async () => {
      const result = await pool.query(
        `
        SELECT ci.id, ci.quantity, p.name, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = $1
      `,
        [userId]
      );
      return result.rows;
    },
    args: userId,
  });
};

export const findCartItem = async (userId, productId) => {
  return await execute({
    success: 200,
    callback: async () => {
      const result = await pool.query(
        `
        SELECT * FROM cart_items
        WHERE user_id = $1 AND product_id = $2
      `,
        [userId, productId]
      );
      return result.rows[0]; // Solo se devuelve el primer elemento
    },
    args: [userId, productId],
  });
};

export const insertCartItem = async (userId, productId, quantity) => {
  return await execute({
    success: 201,
    callback: async () => {
      await pool.query(
        `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
      `,
        [userId, productId, quantity]
      );
      return { message: "Producto agregado al carrito" };
    },
    args: [userId, productId, quantity],
  });
};

export const updateCartItemQuantity = async (quantity, itemId) => {
  return await execute({
    success: 200,
    callback: async () => {
      const result = await pool.query(
        `
        UPDATE cart_items SET quantity = quantity + $1
        WHERE id = $2
      `,
        [quantity, itemId]
      );
      return result.rowCount === 0
        ? { error: "No se encontró el artículo para actualizar" }
        : { message: "Cantidad actualizada" };
    },
    args: [quantity, itemId],
  });
};

export const updateCartItem = async (quantity, itemId, userId) => {
  return await execute({
    success: 200,
    callback: async () => {
      const result = await pool.query(
        `
        UPDATE cart_items SET quantity = $1
        WHERE id = $2 AND user_id = $3
        RETURNING id
      `,
        [quantity, itemId, userId]
      );
      if (result.rowCount === 0) {
        throw new Error("Artículo no encontrado o no autorizado");
      }
      return { message: "Cantidad actualizada" };
    },
    args: [quantity, itemId, userId],
  });
};

export const deleteCartItem = async (itemId, userId) => {
  return await execute({
    success: 200,
    callback: async () => {
      const result = await pool.query(
        `
        DELETE FROM cart_items
        WHERE id = $1 AND user_id = $2
        RETURNING id
      `,
        [itemId, userId]
      );
      if (result.rowCount === 0) {
        throw new Error("Artículo no encontrado o no autorizado");
      }
      return { message: "Producto eliminado del carrito" };
    },
    args: [itemId, userId],
  });
};
