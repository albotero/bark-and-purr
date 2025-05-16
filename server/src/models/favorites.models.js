import connectionDb from "../../config/db/connection.db.js";

// Crear un favorito
export const createFavorite = async ({ userId, productId }) => {
  try {
    console.log(" Creando favorito con:", { userId, productId });
    const result = await connectionDb.query(
      "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *",
      [userId, productId]
    );
    console.log("Favorito creado:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error(" Error en createFavorite:", error.message);
    throw new Error("Error creating favorite: " + error.message);
  }
};

// Obtener favoritos por ID de usuario
export const getFavoritesByUser = async ({ userId }) => {
  try {
    const result = await connectionDb.query(
      `SELECT DISTINCT ON (p.id) f.id as favorite_id, p.*
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = $1
      ORDER BY p.id, f.created_at DESC`,
      [userId]
    );

    const uniqueProducts = [];
    const seenIds = new Set();

    for (const row of result.rows) {
      if (!seenIds.has(row.id)) {
        seenIds.add(row.id);
        uniqueProducts.push(row);
      }
    }

    return uniqueProducts;
  } catch (error) {
    throw new Error("Error getting favorites: " + error.message);
  }
};

// Eliminar favorito por su ID
export const deleteFavorite = async ({ favoriteId }) => {
  try {
    const result = await connectionDb.query(
      "DELETE FROM favorites WHERE id = $1",
      [favoriteId]
    );

    if (result.rowCount === 0) {
      const error = new Error("Favorite not found");
      error.status = 404;
      throw error;
    }

    // No devolver mensaje, ya que 204 no lleva cuerpo
    return null;
  } catch (error) {
    const err = new Error("Error deleting favorite: " + error.message);
    err.status = error.status || 500;
    throw err;
  }
};
