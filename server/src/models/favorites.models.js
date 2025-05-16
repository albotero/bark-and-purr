import format from "pg-format"
import executeQuery from "./executeQuery.js"

// Crear un favorito
export const createFavorite = async ({ userId, productId }) => {
  try {
    console.log(" Creando favorito con:", { userId, productId })
    const [favorite] = await executeQuery(
      format("INSERT INTO favorites (user_id, product_id) VALUES (%s, %s) RETURNING *", userId, productId)
    )
    return favorite
  } catch (error) {
    console.error(" Error en createFavorite:", error.message)
    throw new Error("Error creating favorite: " + error.message)
  }
}

// Obtener favoritos por ID de usuario
export const getFavoritesByUser = async ({ userId }) => {
  try {
    const results = await executeQuery(
      format(
        `SELECT DISTINCT ON (p.id) f.id as favorite_id, p.*
          FROM favorites f
          JOIN products p ON f.product_id = p.id
          WHERE f.user_id = %s
          ORDER BY p.id, f.created_at DESC`,
        userId
      )
    )

    const uniqueProducts = []
    const seenIds = new Set()

    results.forEach((row) => {
      if (!seenIds.has(row.id)) {
        seenIds.add(row.id)
        uniqueProducts.push(row)
      }
    })

    return uniqueProducts
  } catch (error) {
    throw new Error("Error getting favorites: " + error.message)
  }
}

// Eliminar favorito por su ID
export const deleteFavorite = async ({ favoriteId, userId }) => {
  try {
    const [deletedItem] = await executeQuery(
      format("DELETE FROM favorites WHERE id = %s AND user_id = %s RETURNING *", favoriteId, userId)
    )

    console.log("deleted", deletedItem)

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
