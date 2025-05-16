import express from "express"
import cors from "cors"
import envs from "./config/envs.js"
import authRoutes from "./src/routes/auth.routes.js"
import productRoutes from "./src/routes/products.routes.js"
import favoritesRoutes from "./src/routes/favorites.routes.js"
import usersRoutes from "./src/routes/user.routes.js"
import cartRoutes from "./src/routes/cart.routes.js"
import publicationsRoutes from "./src/routes/publications.routes.js"
import ordersRoutes from "./src/routes/orders.routes.js"

const whiteList = [envs.SERVER_URL, envs.CLIENT_URL]
const port = envs.PORT || 3000

const app = express()

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (whiteList.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes)
app.use("/api", productRoutes)
app.use("/favorites", favoritesRoutes)
app.use("/users", usersRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/publications", publicationsRoutes)
app.use("/api/orders", ordersRoutes)

app.listen(port, () => console.log(`Listening on Port ${port}`))
