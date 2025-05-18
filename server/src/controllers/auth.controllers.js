import { registerUser, loginUser, userProfile, modifyUserProfile, updateAvatarHandler } from "../models/auth.models.js"
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
  execute({
    res,
    success: 200,
    callback: userProfile,
    args: { id: req.user.id },
  })
}

export const updateUserProfile = async (req, res) => {
  execute({
    res,
    success: 200,
    callback: modifyUserProfile,
    args: { id: req.user.id, data: req.body },
  })
}

export const updateAvatar = async (req, res) => {
  execute({
    res,
    success: 200,
    callback: updateAvatarHandler,
    args: { id: req.user.id, file: req.file },
  })
}
