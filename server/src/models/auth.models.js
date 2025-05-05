import bcrypt from "bcrypt"
import executeQuery from "./executeQuery.js"

export const registerUser = async ({ surname, last_name, email, password, birthday }) => {
  if (!password) {
    return res.status(400).json({ error: "Password es requerido" })
  }
  // console.log('Password recibido:', password);
  const passwordHash = await bcrypt.hash(password, 10)

  const existing = await executeQuery({ text: "SELECT * FROM users WHERE email = $1", values: [email] })
  if (existing.rows.length > 0) {
    return res.status(400).json({ error: "Email already exists" })
  }

  return await executeQuery({
    text: `INSERT INTO users (surname, last_name, email, password_hash, birthday, avatar_url, avatar_key)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, surname, last_name, email`,
    values: [surname, last_name, email, passwordHash, birthday, "https://placehold.co/100x100", "placeholder-key"],
  })[0]
}
