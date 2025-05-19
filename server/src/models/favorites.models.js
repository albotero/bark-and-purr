import { doTranslation } from "../common/translate.js"
import executeQuery from "./executeQuery.js"

// Crear un favorito
export const createFavorite = async ({ userId, productId }) => {
  try {
    const [favorite] = await executeQuery({
      text: "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *",
      values: [userId, productId],
    })
    return favorite
  } catch (error) {
    console.error(" Error en createFavorite:", error.message)
    throw new Error("Error creating favorite: " + error.message)
  }
}

// Obtener favoritos por ID de usuario
export const getFavoritesByUser = async ({ userId, lang }) => {
  try {
    const results = await executeQuery({
      text: `
        SELECT
          DISTINCT ON (p.id) f.id AS favorite_id,
          f.product_id,
          p.*,
          (
            SELECT imgs.url
            FROM product_images imgs
            WHERE imgs.product_id = p.id
            ORDER BY imgs.id
            LIMIT 1
          ) AS thumbnail,
          (
            SELECT AVG(rating)::FLOAT
            FROM reviews
            WHERE reviews.product_id = p.id
          ) AS rating
        FROM favorites f
        JOIN products p ON f.product_id = p.id
        WHERE f.user_id = $1
        ORDER BY p.id, f.created_at DESC`,
      values: [userId],
    })
    const favorites = await Promise.all(
      results.map(async (fav) => {
        const tTitle = await doTranslation("auto", lang, fav.title)
        const tDesc = await doTranslation("auto", lang, fav.description)
        return {
          ...fav,
          title: {
            ...tTitle,
            content: tTitle.translated ? tTitle.translation : fav.title,
          },
          description: {
            ...tDesc,
            content: tDesc.translated ? tDesc.translation : fav.description,
          },
        }
      })
    )
    return { favorites }
  } catch (error) {
    throw new Error("Error getting favorites: " + error.message)
  }
}

// Eliminar favorito por su ID
export const deleteFavorite = async ({ favoriteId, userId }) => {
  try {
    const [deletedItem] = await executeQuery({
      text: "DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING *",
      values: [favoriteId, userId],
    })

    if (!deletedItem) {
      const error = new Error("Favorite not found")
      error.status = 404
      throw error
    }

    // No devolver mensaje, ya que 204 no lleva cuerpo
    return null
  } catch (error) {
    const err = new Error("Error deleting favorite: " + error.message)
    err.status = error.status || 500
    throw err
  }
}
