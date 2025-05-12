import pool from "../../config/db/connection.db.js";

export const findOrCreateActiveCart = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`,
    [userId]
  );

  if (result.rows.length > 0) return result.rows[0];

  const insert = await pool.query(
    `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
    [userId]
  );

  return insert.rows[0];
};

export const getActiveCart = async (userId) => {
  const result = await pool.query(
    `
    SELECT * FROM carts
    WHERE user_id = $1 AND status = 'active'
    LIMIT 1
    `,
    [userId]
  );
  return result.rows[0]; 
};


export const createCart = async (userId) => {
  const result = await pool.query(
    `
    INSERT INTO carts (user_id, status)
    VALUES ($1, 'active')
    RETURNING id, user_id, status, status_time, expiration
    `,
    [userId]
  );
  return result.rows[0]; 
};

export const findCartItemsByUser = async (userId) => {
  const result = await pool.query(
    `
    SELECT pbc.id, pbc.quantity, p.title, p.price
    FROM carts c
    JOIN products_by_cart pbc ON c.id = pbc.cart_id
    JOIN products p ON p.id = pbc.product_id
    WHERE c.user_id = $1 AND c.status = 'active'
    `,
    [userId]
  );

  return result.rows;
};

export const findCartItem = async (cartId, productId) => {
  const result = await pool.query(
    `SELECT * FROM products_by_cart WHERE cart_id = $1 AND product_id = $2`,
    [cartId, productId]
  );
  return result.rows[0];
};

/**
 *Check if an item already exists in your cart. If so, update the quantity; otherwise, add the item to your cart.
 */

export const insertCartItem = async (cartId, productId, quantity) => {
  // Check if the item already exists in the cart
  const existingItem = await pool.query(
    `SELECT * FROM products_by_cart WHERE cart_id = $1 AND product_id = $2`,
    [cartId, productId]
  );

  if (existingItem.rows.length > 0) {
    // If the item already exists, update the quantity
    await updateCartItemQuantity(quantity, existingItem.rows[0].id);
  } else {
    // If the item does not exist, add it to your cart.
    await pool.query(
      `INSERT INTO products_by_cart (cart_id, product_id, quantity) VALUES ($1, $2, $3)`,
      [cartId, productId, quantity]
    );
  }
};

/**
 * Updates the quantity of an item in the cart.
 */

export const updateCartItemQuantity = async (quantity, id) => {
  try {
    const result = await pool.query(
      `UPDATE products_by_cart SET quantity = quantity + $1 WHERE id = $2`,
      [quantity, id]
    );

    if (result.rowCount === 0) {
      throw new Error("The article was not found to update.");
    }
  } catch (error) {
    console.error("Error updating item quantity:", error);
    throw new Error("Error updating quantity");
  }
};


export const updateCartItem = async (quantity, itemId, userId) => {
  const result = await pool.query(
    `
    UPDATE products_by_cart
    SET quantity = $1
    WHERE id = $2 AND cart_id = (
      SELECT id FROM carts WHERE user_id = $3 AND status = 'active'
    )
    `,
    [quantity, itemId, userId]
  );

  return result;
};

export const updateCartStatus = async (cartId, status) => {
  const result = await pool.query(
    `
    UPDATE carts
    SET status = $1, status_time = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, status
    `,
    [status, cartId]
  );
  return result.rows[0]; 
};

export const deleteCartItem = async (itemId, userId) => {
  const result = await pool.query(
    `
    DELETE FROM products_by_cart
    WHERE id = $1 AND cart_id = (
      SELECT id FROM carts WHERE user_id = $2 AND status = 'active'
    )
    `,
    [itemId, userId]
  );

  return result;
};
