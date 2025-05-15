export const validateFavorite = (req, res, next) => {
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  next();
};
