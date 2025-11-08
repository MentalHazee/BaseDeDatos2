// ------------------------------
//  app.js - Configuración principal del servidor
// ------------------------------

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import conectarDB from "./config/db.js";
import { manejarErrores } from "./middlewares/error.middleware.js";

// Importar rutas
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
// Si más adelante agregás reseñas o categorías, las importás igual:
// import reviewRoutes from "./routes/review.routes.js";
// import categoryRoutes from "./routes/category.routes.js";

// Inicialización
dotenv.config();
const app = express();

// ------------------------------
//  Middlewares Globales
// ------------------------------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ------------------------------
//  Conexión a la Base de Datos
// ------------------------------
conectarDB();

// ------------------------------
//  Rutas principales
// ------------------------------
app.use("/api/usuarios", userRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/carrito", cartRoutes);
app.use("/api/ordenes", orderRoutes);
// app.use("/api/resenas", reviewRoutes);
// app.use("/api/categorias", categoryRoutes);

// ------------------------------
//  Middleware Global de Errores
// ------------------------------
app.use(manejarErrores);

// ------------------------------
//  Ruta Base
// ------------------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API E-commerce funcionando correctamente",
  });
});

export default app;
