import connectionDb from "../../config/db/connection.db.js";

export const updateAvatar = async (id, avatar_url, avatar_key) => {
  try {
    const user = await getUserById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    await connectionDb.query(
      'UPDATE users SET avatar_url = $1, avatar_key = $2 WHERE id = $3',
      [avatar_url, avatar_key, id]
    );
  } catch (error) {
    throw new Error(`Error al actualizar el avatar: ${error.message}`);
  }
};

const getUserById = async (id) => {
  const result = await connectionDb.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};
