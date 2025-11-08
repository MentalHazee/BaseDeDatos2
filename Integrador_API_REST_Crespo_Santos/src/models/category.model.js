import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  descripcion: String
}, {
  timestamps: true
});

export default mongoose.model("Categoria", categorySchema);
