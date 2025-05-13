import connectionDb from "../../config/db/connection.db.js";

export const getPublicationsByUser = async (userId) => {
  const result = await connectionDb.query(
    `
    SELECT 
      p.*, 
      pi.id AS image_id,
      pi.url AS image_url, 
      pi.key AS image_key
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    WHERE p.vendor_id = $1
  `,
    [userId]
  );

  const productsMap = {};

  for (const row of result.rows) {
    if (!productsMap[row.id]) {
      productsMap[row.id] = {
        id: row.id,
        title: row.title,
        description: row.description,
        price: row.price,
        stock: row.stock,
        vendor_id: row.vendor_id,
        is_active_product: row.is_active_product,
        created_at: row.created_at,
        images: [],
      };
    }

    if (row.image_id) {
      productsMap[row.id].images.push({
        id: row.image_id,
        url: row.image_url,
        key: row.image_key,
      });
    }
  }

  return Object.values(productsMap);
};

export const getPublicationById = async (id) => {
  const result = await connectionDb.query(
    `
    SELECT 
      p.*, 
      pi.id AS image_id,
      pi.url AS image_url, 
      pi.key AS image_key
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    WHERE p.id = $1
  `,
    [id]
  );

  if (result.rows.length === 0) return null;

  const product = {
    id: result.rows[0].id,
    title: result.rows[0].title,
    description: result.rows[0].description,
    price: result.rows[0].price,
    stock: result.rows[0].stock,
    vendor_id: result.rows[0].vendor_id,
    is_active_product: result.rows[0].is_active_product,
    created_at: result.rows[0].created_at,
    images: [],
  };

  for (const row of result.rows) {
    if (row.image_id) {
      product.images.push({
        id: row.image_id,
        url: row.image_url,
        key: row.image_key,
      });
    }
  }

  return product;
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
  // Delete associated images
  await connectionDb.query("DELETE FROM product_images WHERE product_id = $1", [
    id,
  ]);

  // Then remove the product
  const result = await connectionDb.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [id]
  );

  return result;
};
  