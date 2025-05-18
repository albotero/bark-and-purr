import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sharp from "sharp"
import streamifier from "streamifier"
import cloudinary from "../../config/cloudinary.js"
import executeQuery from "./executeQuery.js"

export const registerUser = async ({ surname, last_name, email, password, birthday }) => {
  if (!password) {
    const error = new Error("Password is required")
    error.status = 400
    throw error
  }

  const existing = await executeQuery({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  })

  if (existing.length > 0) {
    const error = new Error("Email already exists")
    error.status = 400
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const avatar_url = `https://avatar.iran.liara.run/username?username=${
    encodeURIComponent(surname) + "+" + encodeURIComponent(last_name)
  }&background=f4d9b2&color=FF9800`

  const result = await executeQuery({
    text: `INSERT INTO users (surname, last_name, email, password_hash, birthday, avatar_url, avatar_key)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, surname, last_name, email`,
    values: [surname, last_name, email, passwordHash, birthday, avatar_url, "placeholder-key"],
  })

  const user = result[0]

  // Generar token JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" })

  return {
    token,
    user: {
      id: user.id,
      name: `${user.surname} ${user.last_name}`,
      email: user.email,
    },
  }
}

export const loginUser = async ({ email, password }) => {
  const result = await executeQuery({
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  })
  const user = result[0]

  if (!user) {
    const error = new Error("User not found")
    error.status = 401
    throw error
  }

  if (typeof password !== "string") {
    const error = new Error("Password must be a string")
    error.status = 400
    throw error
  }

  const isMatch = await bcrypt.compare(password, user.password_hash)
  if (!isMatch) {
    const error = new Error("Invalid password")
    error.status = 401
    throw error
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" })

  return {
    token,
    user: {
      id: user.id,
      name: user.surname + " " + user.last_name,
      email: user.email,
    },
  }
}

export const userProfile = async ({ id }) => {
  const [user] = await executeQuery({
    text: `
        SELECT
          id, email, surname, last_name, birthday, avatar_url,
          address_line_1, address_line_2, city, state, country, zip_code,
          notify_shipping, notify_purchase, notify_publication, notify_review, notify_pass_change,
          language
        FROM users
        WHERE id = $1
      `,
    values: [id],
  })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  return {
    user: {
      id: user.id,
      name: `${user.surname} ${user.last_name}`,
      email: user.email,
      birthday: user.birthday,
      avatar_url: user.avatar_url,
      address: {
        address_line_1: user.address_line_1,
        address_line_2: user.address_line_2,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        country: user.country,
      },
      preferences: {
        language: user.language,
        notify_shipping: user.notify_shipping,
        notify_purchase: user.notify_purchase,
        notify_publication: user.notify_publication,
        notify_review: user.notify_review,
        notify_pass_change: user.notify_pass_change,
      },
    },
  }
}

export const modifyUserProfile = async ({ id, data }) => {
  const allowedFields = [
    "surname",
    "last_name",
    "birthday",
    "avatar_url",
    "address_line_1",
    "address_line_2",
    "city",
    "state",
    "country",
    "zip_code",
    "language",
    "notify_shipping",
    "notify_purchase",
    "notify_publication",
    "notify_review",
    "notify_pass_change",
  ]

  const fields = []
  const values = []
  let i = 1

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = $${i++}`)
      values.push(data[field])
    }
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No valid fields to update" })
  }

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${i}
    RETURNING *
  `

  values.push(id)

  return await executeQuery({ text: query, values })
}

// Optimizar la imagen
const optimizeImage = (buffer) => {
  return sharp(buffer).resize(300).jpeg({ quality: 80 }).toBuffer()
}

// Subir la imagen a Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
        resource_type: "image",
      },
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      }
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })
}

export const updateAvatarHandler = async ({ id, file }) => {
  if (!file) throw Object.assign(new Error("no_image"), { status: 400 })

  // Optimizar imagen con Sharp
  const optimizedImage = await optimizeImage(file.buffer)

  // Subir a Cloudinary
  const result = await uploadToCloudinary(optimizedImage)

  // Guardar solo URL y public_id en la DB
  const avatarUrl = result.secure_url
  const avatarKey = result.public_id

  // Actualizar la base de datos
  const [avatar_url] = await executeQuery({
    text: "UPDATE users SET avatar_url = $1, avatar_key = $2 WHERE id = $3 RETURNING avatar_url",
    values: [avatarUrl, avatarKey, id],
  })

  return avatar_url
}
