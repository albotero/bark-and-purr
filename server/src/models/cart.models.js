import pool from "../../config/db/connection.db.js";

// Obtener o crear carrito activo
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

// Obtener ítems del carrito de un usuario
export const findCartItemsByUser = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const result = await pool.query(
    `
    SELECT
      pbc.id,
      pbc.quantity,
      p.title,
      pbc.price_unitario AS price,
      (
        SELECT url
        FROM product_images
        WHERE product_id = p.id
        ORDER BY id ASC
        LIMIT 1
      ) AS thumbnail,
      pbc.price_unitario * pbc.quantity AS total
    FROM products_by_cart pbc
    JOIN products p ON p.id = pbc.product_id
    WHERE pbc.cart_id = $1
    `,
    [cart.id]
  );
  return result.rows;
};

// Ver si ya hay un ítem de producto en el carrito
export const findCartItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
  const result = await pool.query(
    `SELECT * FROM products_by_cart WHERE cart_id = $1 AND product_id = $2`,
    [cart.id, productId]
  );
  return result.rows[0];
};

// Obtener el precio del producto desde la tabla products
const getProductPrice = async (productId) => {
  const res = await pool.query("SELECT price FROM products WHERE id = $1", [
    productId,
  ]);
  return res.rows[0]?.price;
};

// Insertar ítem en el carrito
export const insertCartItem = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const unitPrice = await getProductPrice(productId);

  return await pool.query(
    `
    INSERT INTO products_by_cart (cart_id, product_id, quantity, price_unitario)
    VALUES ($1, $2, $3, $4)
    `,
    [cart.id, productId, quantity, unitPrice]
  );
};

// Actualizar cantidad de un ítem existente
export const updateCartItemQuantity = async (newQuantity, cartItemId) => {
  return await pool.query(
    `UPDATE products_by_cart SET quantity = $1 WHERE id = $2`,
    [newQuantity, cartItemId]
  );
};

// Actualizar cantidad asegurando que sea del usuario
export const updateCartItem = async (quantity, itemId, userId) => {
  const cart = await getOrCreateCart(userId);
  return await pool.query(
    `UPDATE products_by_cart SET quantity = $1 WHERE id = $2 AND cart_id = $3 RETURNING id`,
    [quantity, itemId, cart.id]
  );
};

// Eliminar un ítem del carrito
export const deleteCartItem = async (itemId, userId) => {
  const cart = await getOrCreateCart(userId);
  return await pool.query(
    `DELETE FROM products_by_cart WHERE id = $1 AND cart_id = $2 RETURNING id`,
    [itemId, cart.id]
  );
};

// Obtener carrito activo
export const getActiveCart = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM carts WHERE user_id = $1 AND status = 'active'`,
    [userId]
  );
  return result.rows[0];
};

// Actualizar el estado del carrito
export const updateCartStatus = async (cartId, status) => {
  return await pool.query(`UPDATE carts SET status = $1 WHERE id = $2`, [
    status,
    cartId,
  ]);
};
