import bcrypt from "bcrypt"
import executeQuery from "./executeQuery.js"
import jwt from "jsonwebtoken"


export const registerUser = async ({ surname, last_name, email, password, birthday }) => {
  if (!password) {
    const error = new Error("Password is required")
    error.status = 400
    throw error
  }

  const existing = await executeQuery({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email]
  })
  
  if (existing.length > 0) {
    const error = new Error("Email already exists")
    error.status = 400
    throw error
  }  

  const passwordHash = await bcrypt.hash(password, 10)

  const result = await executeQuery({
    text: `INSERT INTO users (surname, last_name, email, password_hash, birthday, avatar_url, avatar_key)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, surname, last_name, email`,
    values: [surname, last_name, email, passwordHash, birthday, "https://placehold.co/100x100", "placeholder-key"]
  })

  return result[0]
}

export const loginUser = async ({ email, password }) => {
  const result = await executeQuery({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email]
  })
  const user = result[0]

  if (!user) {
    const error = new Error("User not found")
    error.status = 401
    throw error
  }

  const isMatch = await bcrypt.compare(password, user.password_hash)
  if (!isMatch) {
    const error = new Error("Invalid password")
    error.status = 401
    throw error
  }
  console.log("JWT_SECRET:", process.env.JWT_SECRET)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" })

  return {
    token,
    user: {
      id: user.id,
      name: user.surname + " " + user.last_name,
      email: user.email
    }
  }
}