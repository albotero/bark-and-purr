import connectionDb from "../../config/db/connection.db.js"
import cloudinary from "../../cloudinary.js"
import sharp from "sharp"
import streamifier from "streamifier"

// Avatar
export const updateAvatar = async (req, res) => {
    const { id } = req.params
    const file = req.file
  
    if (!file) return res.status(400).json({ error: 'No se subió ninguna imagen' })
  
    try {
      // 1. Optimizar imagen con Sharp
      const optimizedImage = await sharp(file.buffer)
        .resize(300) // Puedes ajustar tamaño
        .jpeg({ quality: 80 }) // O .png() si prefieres
        .toBuffer()
  
      // 2. Subir a Cloudinary usando stream
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'avatars', // opcional
              resource_type: 'image'
            },
            (error, result) => {
              if (result) resolve(result)
              else reject(error)
            }
          )
          streamifier.createReadStream(buffer).pipe(stream)
        })
      }
  
      const result = await streamUpload(optimizedImage)
  
      // 3. Guardar solo URL y public_id en la DB
      const avatar_url = result.secure_url
      const avatar_key = result.public_id
  
      await connectionDb.query(
        'UPDATE users SET avatar_url = $1, avatar_key = $2 WHERE id = $3',
        [avatar_url, avatar_key, id]
      )
  
      res.json({ message: 'Avatar actualizado', avatar_url })
  
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }