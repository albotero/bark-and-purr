import { registerUser, loginUser } from "../models/auth.models.js"
import execute from "./execute.js"

export const register = async (req, res) =>
  execute({
    res,
    success: 201,
    callback: registerUser,
    args: req.body,
  })

  export const login = async (req, res) =>
    execute({
      res,
      success: 200,
      callback: loginUser,
      args: req.body,
    })
  
  export const getUserProfile = async (req, res) => {
    const { id, email } = req.user;
  
    return res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        id,
        email
      }
    });
  };
    