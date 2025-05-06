export const validateImage = (req, res, next) => {
    const file = req.file;
  
    if (!file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }
  
    const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  
    if (!fileTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only images are allowed' });
    }
  
    next();
}