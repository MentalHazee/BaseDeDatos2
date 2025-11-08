import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ["pendiente", "pagado", "enviado", "entregado"],
    default: "pendiente"
  },
  metodoPago: String,
  total: {
    type: Number,
    required: true
  },
  items: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      },
      subtotal: {
        type: Number,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model("Orden", orderSchema);
