import connectionDb from "../../config/db/connection.db.js"

export const addFavorite = async (req, res) => {
  const { user_id, product_id } = req.body
  try {
    const result = await connectionDb.query(
      'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [user_id, product_id]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getFavoritesByUser = async (req, res) => {
  const { user_id } = req.params
  try {
    const result = await connectionDb.query(
      `SELECT f.id, p.* FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = $1`,
      [user_id]
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteFavorite = async (req, res) => {
  const { id } = req.params
  try {
    await connectionDb.query('DELETE FROM favorites WHERE id = $1', [id])
    res.json({ message: 'Favorito eliminado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
