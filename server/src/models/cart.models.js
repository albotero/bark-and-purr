import pool from "../../config/db/connection.db.js";

export const getOrCreateCart = async (userId) => {
  const existing = await pool.query(
    `SELECT * FROM carts WHERE user_id = $1 AND status = 'active'`,
    [userId]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  const created = await pool.query(
    `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
    [userId]
  );
  return created.rows[0];
};


export const findCartItemsByUser = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const result = await pool.query(
    `
    SELECT
      pbc.id,
      pbc.quantity,
      p.title,
      p.price,
      (
        SELECT url
        FROM product_images
        WHERE product_id = p.id
        ORDER BY id ASC
        LIMIT 1
      ) AS thumbnail,
      p.price * pbc.quantity AS total
    FROM products_by_cart pbc
    JOIN products p ON p.id = pbc.product_id
    WHERE pbc.cart_id = $1
    `,
    [cart.id]
  );
  return result.rows;
};


export const findCartItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
  const result = await pool.query(
    `SELECT * FROM products_by_cart WHERE cart_id = $1 AND product_id = $2`,
    [cart.id, productId]
  );
  return result.rows[0];
};

export const insertCartItem = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);
  await pool.query(
    `INSERT INTO products_by_cart (cart_id, product_id, quantity) VALUES ($1, $2, $3)`,
    [cart.id, productId, quantity]
  );
};

export const updateCartItemQuantity = async (newQuantity, cartItemId) => {
  await db.query(`UPDATE cart_items SET quantity = $1 WHERE id = $2`, [
    newQuantity,
    cartItemId,
  ]);
};

export const updateCartItem = async (quantity, itemId, userId) => {
  const cart = await getOrCreateCart(userId);
  const result = await pool.query(
    `UPDATE products_by_cart SET quantity = $1 WHERE id = $2 AND cart_id = $3 RETURNING id`,
    [quantity, itemId, cart.id]
  );
  return result;
};

export const deleteCartItem = async (itemId, userId) => {
  const cart = await getOrCreateCart(userId);
  const result = await pool.query(
    `DELETE FROM products_by_cart WHERE id = $1 AND cart_id = $2 RETURNING id`,
    [itemId, cart.id]
  );
  return result;
};

export const getActiveCart = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM carts WHERE user_id = $1 AND status = 'active'`,
    [userId]
  );
  return result.rows[0];
};

export const updateCartStatus = async (cartId, status) => {
  return await pool.query(`UPDATE carts SET status = $1 WHERE id = $2`, [
    status,
    cartId,
  ]);
};
