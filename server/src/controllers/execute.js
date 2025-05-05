export default async ({ res, success, callback, args }) => {
  try {
    res.status(success).json(await callback(args))
  } catch (error) {
    res.status(500).json(error)
  }
}
