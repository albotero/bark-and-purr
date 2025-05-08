import execute from "./execute.js";
import { updateAvatar } from "../models/user.models.js";
import cloudinary from "../../config/cloudinary.js";
import sharp from "sharp";
import streamifier from "streamifier";

export const updateAvatarController = (req, res) => {
  execute({
    res,
    success: 200,
    callback: updateAvatarHandler,
    args: { req, res },
  });
};

const updateAvatarHandler = async ({ req, res }) => {
  const { id } = req.params;
  const file = req.file;

  if (!file)
    return res.status(400).json({ error: "No se subió ninguna imagen" });

  try {
    // Optimizar imagen con Sharp
    const optimizedImage = await optimizeImage(file.buffer);

    // Subir a Cloudinary
    const result = await uploadToCloudinary(optimizedImage);

    // Guardar solo URL y public_id en la DB
    const avatar_url = result.secure_url;
    const avatar_key = result.public_id;

    // Actualizar la base de datos
    await updateAvatar(id, avatar_url, avatar_key);

    // Respuesta
    res.json({ message: "Avatar actualizado", avatar_url });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Error al actualizar el avatar: ${err.message}` });
  }
};

// Optimizar la imagen
const optimizeImage = (buffer) => {
  return sharp(buffer).resize(300).jpeg({ quality: 80 }).toBuffer();
};

// Subir la imagen a Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
        resource_type: "image",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
