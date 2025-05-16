import jwt from "jsonwebtoken";
import envs from "../../config/envs.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const extractToken = token.split(" ")[1];

    const decoded = jwt.verify(extractToken, envs.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export { verifyToken };
