// ------------------------------
//  app.js - Configuración principal del servidor
// ------------------------------

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import conectarDB from "./config/db.js";
import { manejarErrores } from "./middlewares/error.middleware.js";

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import reviewRoutes from "./routes/review.routes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

conectarDB();

app.use("/api/usuarios", userRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/carrito", cartRoutes);
app.use("/api/ordenes", orderRoutes);
app.use("/api/resenas", reviewRoutes);
app.use("/api/categorias", categoryRoutes);

app.use(manejarErrores);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API E-commerce funcionando correctamente",
  });
});

export default app;
