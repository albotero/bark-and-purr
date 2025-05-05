import { registerUser } from "../models/auth.models.js"

export const register = async (req, res) =>
  execute({
    res,
    success: 201,
    callback: registerUser,
    args: req.body,
  })
