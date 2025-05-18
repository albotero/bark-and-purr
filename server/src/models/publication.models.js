import executeQuery from "./executeQuery.js"

export const getAllPublications = async () => {
  const publications = await executeQuery(`
    SELECT 
      p.*,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('url', pi.url, 'key', pi.key)
        ) FILTER (WHERE pi.url IS NOT NULL),
        '[]'
      ) AS images,
      COUNT(DISTINCT r.id) AS review_count,
      ROUND(AVG(r.rating), 1) AS average_rating
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN reviews r ON r.product_id = p.id
    WHERE p.is_active_product = true
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `)

  return { publications }
}

export const getPublicationsByUser = async (userId) => {
  const publications = await executeQuery({
    text: `
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
      ORDER BY p.created_at DESC`,
    values: [userId],
  })

  return {
    publications: publications.map((pub) => ({
      ...pub,
      thumbnail: pub.images?.[0]?.url || "/placeholder.png",
    })),
  }
}

export const getPublicationById = async (id) => {
  const publication = await executeQuery({
    text: `
      SELECT 
        p.*,
        (
          SELECT json_agg(json_build_object('url', pi.url, 'key', pi.key))
          FROM product_images pi
          WHERE pi.product_id = p.id
        ) AS images
      FROM products p
      WHERE p.id = $1`,
    values: [id],
  })

  return publication
}

export const createPublication = async ({ title, description, price, stock, vendor_id }) => {
  const publication = await executeQuery({
    text: `
      INSERT INTO products (title, description, price, stock, vendor_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
    values: [title, description, price, stock, vendor_id],
  })

  return publication
}

export const addImagesToProduct = async (productId, files) => {
  const imageInsertPromises = files.map(
    async (file) =>
      await executeQuery({
        text: `
          INSERT INTO product_images (product_id, url, key)
          VALUES ($1, $2, $3)`,
        values: [productId, `/uploads/${file.originalname}`, file.originalname],
      })
  )

  await Promise.all(imageInsertPromises)
}

export const updatePublication = async (id, fields) => {
  const keys = Object.keys(fields)
  const values = Object.values(fields)

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ")
  values.push(id)

  const publication = await executeQuery({
    text: `
      UPDATE products SET ${setClause}
      WHERE id = $${values.length}
      RETURNING *`,
    values,
  })

  return publication
}

export const deletePublicationById = async ({ productId, userId }) => {
  const [existing] = await getPublicationById(productId)

  if (!existing) {
    throw Object.assign(new Error("Publication not found"), {
      status: 404,
    })
  }

  if (existing.vendor_id !== userId) {
    throw Object.assign(new Error("Unauthorized access"), { status: 403 })
  }

  // Delete relationships with carts
  await executeQuery({
    text: "DELETE FROM products_by_cart WHERE product_id = $1",
    values: [productId],
  })

  // Delete product images
  await executeQuery({
    text: "DELETE FROM product_images WHERE product_id = $1",
    values: [productId],
  })

  // Delete the post
  const result = await executeQuery({
    text: "DELETE FROM products WHERE id = $1 RETURNING *",
    values: [productId],
  })

  if (!result) {
    throw Object.assign(new Error("Product not found or could not be deleted"), {
      status: 404,
    })
  }

  return result
}

export const insertProductImages = async (productId, images) => {
  const values = []
  const placeholders = []

  images.forEach((img, i) => {
    const idx = i * 3
    values.push(img.url, img.key, productId)
    placeholders.push(`($${idx + 1}, $${idx + 2}, $${idx + 3})`)
  })

  const productImages = await executeQuery({
    text: `
      INSERT INTO product_images (url, key, product_id)
      VALUES ${placeholders.join(", ")}
      RETURNING *`,
    values,
  })

  return { images: productImages }
}
