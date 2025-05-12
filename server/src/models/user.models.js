import connectionDb from "../../config/db/connection.db.js";

export const updateAvatar = async (id, avatar_url, avatar_key) => {
    await connectionDb.query(
        'UPDATE users SET avatar_url = $1, avatar_key = $2 WHERE id = $3',
        [avatar_url, avatar_key, id]
    );
}