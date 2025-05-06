export default async ({ res, success, callback, args }) => {
  try {
    const result = await callback(args)
    res.status(success).json(result)
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({ message: error.message || "Internal Server Error" })
  }
}
