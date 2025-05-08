export const validateImage = (req, res, next) => {
    const file = req.file;
    
    // Verificar si no hay archivo
    if (!file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    
    // Tipos de archivos permitidos
    const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    // Verificar el tipo de archivo
    if (!fileTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Tipo de archivo no válido. Solo imágenes permitidas' });
    }
    
    // Verificar el tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return res.status(400).json({ error: 'El archivo es demasiado grande. El tamaño máximo es 5MB' });
    }
  
    next();
  }
