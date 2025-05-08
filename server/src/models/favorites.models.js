import connectionDb from "../../config/db/connection.db.js";

export const addFavorite = async ({ user_id, product_id }) => {
  const result = await connectionDb.query(
    "INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *",
    [user_id, product_id]
  );
  return result.rows[0];
};

export const getFavoritesByUser = async ({ user_id }) => {
  const result = await connectionDb.query(
    `SELECT f.id, p.* FROM favorites f
     JOIN products p ON f.product_id = p.id
     WHERE f.user_id = $1`,
    [user_id]
  );
  return result.rows;
};

export const deleteFavorite = async ({ id }) => {
  await connectionDb.query("DELETE FROM favorites WHERE id = $1", [id]);
  return { message: "Favorito eliminado" };
};
