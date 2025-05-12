export const validateFavorite = (req, res, next) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res
      .status(400)
      .json({ error: "User ID and Product ID are required" });
  }

  next();
};
