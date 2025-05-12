import express from "express";
import cors from "cors";
import envs from "./config/envs.js";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/products.routes.js";
import favoritesRoutes from "./src/routes/favorites.routes.js";
import usersRoutes from "./src/routes/user.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";

const whiteList = [envs.SERVER_URL, envs.CLIENT_URL];
const port = envs.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: (origin, callback) =>
      !origin || whiteList.includes(origin)
        ? callback(null, true)
        : callback(new Error(`CORS Error: ${origin}`), false),
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/users", usersRoutes);
app.use("/api/users/cart", cartRoutes);


app.listen(port, () => console.log(`Listening on Port ${port}`));
