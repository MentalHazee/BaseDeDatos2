import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: String,
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  marca: String,
  reseñas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resena"
  }]
}, {
  timestamps: true
});

export default mongoose.model("Producto", productSchema);
