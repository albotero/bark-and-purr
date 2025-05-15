import connectionDb from "../../config/db/connection.db.js";

export const getAllPublications = async () => {
  const result = await connectionDb.query(`
    SELECT 
      p.*,
      COALESCE(json_agg(DISTINCT jsonb_build_object('url', pi.url, 'key', pi.key)) FILTER (WHERE p.is_active = true), '[]') AS images,
      COUNT(DISTINCT r.id) AS review_count,
      ROUND(AVG(r.rating), 1) AS average_rating
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN reviews r ON r.product_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);

  return result.rows;
};

export const getPublicationsByUser = async (userId) => {
  const result = await connectionDb.query(
    `
    SELECT 
      p.*,
      (
        SELECT json_agg(json_build_object('url', pi.url, 'key', pi.key))
        FROM product_images pi
        WHERE pi.product_id = p.id
      ) AS images,
      COUNT(r.id) AS review_count,
      ROUND(AVG(r.rating), 1) AS average_rating
    FROM products p
    LEFT JOIN reviews r ON r.product_id = p.id
    WHERE p.vendor_id = $1
    GROUP BY p.id
    ORDER BY p.created_at DESC
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
      (
        SELECT json_agg(json_build_object('url', pi.url, 'key', pi.key))
        FROM product_images pi
        WHERE pi.product_id = p.id
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


export const addImagesToProduct = async (productId, files) => {
  const imageInsertPromises = files.map((file) =>
    connectionDb.query(
      `INSERT INTO product_images (product_id, url, key)
       VALUES ($1, $2, $3)`,
      [
        productId,
        `/uploads/${file.originalname}`, 
        file.originalname,
      ]
    )
  );

  await Promise.all(imageInsertPromises);
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

export const insertProductImages = async (productId, images) => {
  const values = [];
  const placeholders = [];

  images.forEach((img, i) => {
    const idx = i * 3;
    values.push(img.url, img.key, productId);
    placeholders.push(`($${idx + 1}, $${idx + 2}, $${idx + 3})`);
  });

  const query = `
    INSERT INTO product_images (url, key, product_id)
    VALUES ${placeholders.join(", ")}
    RETURNING *;
  `;

  const result = await connectionDb.query(query, values);
  return result.rows;
};