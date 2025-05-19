import cloudinary from "../../config/cloudinary.js"
import execute from "../controllers/execute.js"
import {
  getPublicationsByUser,
  getPublicationById,
  getAllPublications,
  deletePublicationById,
  updatePublication,
  insertProductImages,
} from "../models/publications.models.js"
import connectionDb from "../../config/db/connection.db.js"

// Get all publications by the authenticated user
export const getPublications = async (req, res) => {
  await execute({
    res,
    success: 200,
    callback: getPublicationsByUser,
    args: req.user.id,
  })
}

// Get a publication by ID
export const getPublicationByIdController = async (req, res) => {
  await execute({
    res,
    success: 200,
    args: req.params.id,
    callback: getPublicationById,
  })
}

export const getPublicationsController = async (req, res) => {
  try {
    const publications = await getAllPublications()
    res.status(200).json(publications)
  } catch (err) {
    console.error("Error getting publications:", err)
    res.status(500).json({ error: "Server error" })
  }
}

export const createPublicationController = async (req, res) => {
  const vendor_id = req.user.id
  const { title, description, price, stock } = req.body

  try {
    if (!title || !description || !price || !stock) {
      return res.status(400).json({ message: "Missing required fields" })
    }
    if (!title.trim() || !description.trim()) {
      return res.status(400).json({ message: "Title and description cannot be empty" })
    }

    const priceNum = parseInt(price)
    const stockNum = parseInt(stock)

    if (isNaN(priceNum) || isNaN(stockNum)) {
      return res.status(400).json({ message: "Price and stock must be valid numbers" })
    }

    if (priceNum < 0 || stockNum < 0) {
      return res.status(400).json({ message: "Price and stock must be non-negative" })
    }

    const insertProductResult = await connectionDb.query(
      `INSERT INTO products (title, description, price, stock, vendor_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, priceNum, stockNum, vendor_id]
    )

    const newProduct = insertProductResult.rows[0]

    // Upload images to Cloudinary and insert into the DB
    if (req.files && req.files.length > 0) {
      const uploadedImages = await uploadImagesToCloudinary(req.files)
      await insertProductImages(newProduct.id, uploadedImages)
    }

    res.status(201).json(newProduct)
  } catch (error) {
    console.error("Error creating publication:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const updatePublicationController = async (req, res) => {
  await execute({
    res,
    success: 200,
    args: { ...req.params, ...req.body },
    callback: async ({ id, imagesToDelete = "[]", ...fields }) => {
      const existing = await getPublicationById(id)

      if (!existing) {
        throw Object.assign(new Error("Publication not found"), {
          status: 404,
        })
      }

      if (existing.vendor_id !== req.user.id) {
        throw Object.assign(new Error("Unauthorized access"), { status: 403 })
      }

      // Validations of empty or incorrect fields
      if (fields.title !== undefined && fields.title.trim() === "") {
        throw Object.assign(new Error("Title cannot be empty"), {
          status: 400,
        })
      }
      if (fields.description !== undefined && fields.description.trim() === "") {
        throw Object.assign(new Error("Description cannot be empty"), {
          status: 400,
        })
      }
      if (fields.price !== undefined && isNaN(parseFloat(fields.price))) {
        throw Object.assign(new Error("Price must be a valid number"), {
          status: 400,
        })
      }
      if (fields.stock !== undefined && isNaN(parseInt(fields.stock))) {
        throw Object.assign(new Error("Stock must be a valid number"), {
          status: 400,
        })
      }

      const parsedImagesToDelete = typeof imagesToDelete === "string" ? JSON.parse(imagesToDelete) : imagesToDelete

      // 1. Delete selected images
      if (Array.isArray(parsedImagesToDelete) && parsedImagesToDelete.length > 0) {
        for (const key of parsedImagesToDelete) {
          try {
            // Delete from Cloudinary
            await cloudinary.uploader.destroy(key)
          } catch (err) {
            console.warn(`Error deleting image ${key} from Cloudinary:`, err)
          }

          // Delete from DB
          await connectionDb.query(`DELETE FROM product_images WHERE product_id = $1 AND key = $2`, [id, key])
        }
      }

      // 2.Upload new images if they exist
      if (req.files && req.files.length > 0) {
        const uploadedImages = await uploadImagesToCloudinary(req.files)
        await insertProductImages(id, uploadedImages)
      }

      // 3. Update product fields
      const updatedProduct = await updatePublication(id, fields)

      // 4. Get the updated product with images
      const updatedWithImages = await getPublicationById(id)
      return updatedWithImages
    },
  })
}

// Delete a publication
export const deletePublication = async (req, res) => {
  await execute({
    res,
    success: 200,
    callback: deletePublicationById,
    args: { productId: req.params.id, userId: req.user.id },
  })
}

export const uploadImagesToCloudinary = async (files) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "publications",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error)
          resolve({
            url: result.secure_url,
            key: result.public_id,
          })
        }
      )

      stream.end(file.buffer)
    })
  })

  const results = await Promise.allSettled(uploadPromises)

  const successfulUploads = results.filter((r) => r.status === "fulfilled").map((r) => r.value)

  const failed = results.filter((r) => r.status === "rejected")
  if (failed.length > 0) {
    console.warn(`${failed.length} image(s) failed to upload`)
  }

  return successfulUploads
}

export const togglePublicationStatus = async (req, res) => {
  const { id } = req.params
  const { is_active } = req.body
  const userId = req.user.id

  try {
    const result = await connectionDb.query(
      "UPDATE products SET is_active_product = $1 WHERE id = $2 AND vendor_id = $3 RETURNING *",
      [is_active, id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Publication not found or not yours" })
    }

    //  Get product images
    const imagesResult = await connectionDb.query("SELECT url FROM product_images WHERE product_id = $1", [id])

    //  Include images in the response object
    const updatedProduct = {
      ...result.rows[0],
      images: imagesResult.rows.map((img) => ({ url: img.url })),
    }

    res.status(200).json(updatedProduct)
  } catch (error) {
    console.error("Error toggling publication status:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
