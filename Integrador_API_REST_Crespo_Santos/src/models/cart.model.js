import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
    unique: true // un carrito por usuario
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model("Carrito", cartSchema);
