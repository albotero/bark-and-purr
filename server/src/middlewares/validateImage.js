export const validateImage = (req, res, next) => {
  const file = req.file
  console.log(file)

  // Verificar si no hay archivo
  if (!file) {
    return res.status(400).json({ error: "no_image" })
  }

  // Tipos de archivos permitidos
  const fileTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"]

  // Verificar el tipo de archivo
  if (!fileTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: "file_type_not_allowed" })
  }

  // Verificar el tamaño del archivo (máximo 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return res.status(400).json({
      error: "file_too_large",
    })
  }

  next()
}
