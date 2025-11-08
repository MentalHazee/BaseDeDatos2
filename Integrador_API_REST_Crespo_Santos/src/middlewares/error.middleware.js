// Middleware global de manejo de errores
export const manejarErrores = (err, req, res, next) => {
  console.error("Error capturado:", err);

  const status = err.statusCode || 500;
  const mensaje = err.message || "Error interno del servidor";

  res.status(status).json({
    success: false,
    message: mensaje
  });
};
