import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true
  },
  comentario: {
    type: String,
    trim: true
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

export default mongoose.model("Resena", reviewSchema);
