import connectionDb from "../../config/db/connection.db.js";

export const getPublicationsByUser = async (userId) => {
  const result = await connectionDb.query(
    `
    SELECT 
      p.*,
      ARRAY(
        SELECT pi.url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.id
      ) AS images
    FROM products p
    WHERE p.vendor_id = $1
    `,
    [userId]
  );

  return result.rows;
};

export const getPublicationById = async (id) => {
  const result = await connectionDb.query(
    `
    SELECT 
      p.*,
      ARRAY(
        SELECT pi.url
        FROM product_images pi
        WHERE pi.product_id = p.id
        ORDER BY pi.id
      ) AS images
    FROM products p
    WHERE p.id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
};

export const createPublication = async ({
  title,
  description,
  price,
  stock,
  vendor_id,
}) => {
  const result = await connectionDb.query(
    `
    INSERT INTO products (title, description, price, stock, vendor_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [title, description, price, stock, vendor_id]
  );

  return result.rows[0];
};

export const addProductImage = async (productId, url, key) => {
  const result = await connectionDb.query(
    `
    INSERT INTO product_images (product_id, url, key)
    VALUES ($1, $2, $3)
    RETURNING id, url, key
    `,
    [productId, url, key]
  );

  return result.rows[0];
};

export const updatePublication = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  values.push(id);

  const result = await connectionDb.query(
    `
    UPDATE products SET ${setClause}
    WHERE id = $${values.length}
    RETURNING *
    `,
    values
  );

  return result.rows[0];
};

export const deletePublicationById = async (id) => {
  await connectionDb.query("DELETE FROM product_images WHERE product_id = $1", [
    id,
  ]);

  const result = await connectionDb.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [id]
  );

  return result;
};
