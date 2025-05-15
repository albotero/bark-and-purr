import connectionDb from "../../config/db/connection.db.js";

// Crear un favorito
export const createFavorite = async ({ userId, productId }) => {
  const result = await connectionDb.query(
    "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *",
    [userId, productId]
  );
  return result.rows[0];
};

// Obtener favoritos por ID de usuario
export const getFavoritesByUser = async ({ userId }) => {
  const result = await connectionDb.query(
    `SELECT f.id as favorite_id, p.* 
     FROM favorites f
     JOIN products p ON f.product_id = p.id
     WHERE f.user_id = $1`,
    [userId]
  );
  return result.rows;
};

// Eliminar favorito por su ID
export const deleteFavorite = async ({ favoriteId }) => {
  await connectionDb.query("DELETE FROM favorites WHERE id = $1", [favoriteId]);
  return { message: "Favorite deleted" };
};
