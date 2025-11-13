// scripts/seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/admin.model.js";

dotenv.config();

// Configuración de Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Conectado a MongoDB para crear Administrador ---');
    } catch (err) {
        console.error(` Error de conexión: ${err.message}`);
        process.exit(1);
    }
};

const crearAdminUser = async () => {
    await connectDB();

    try {
        const emailAdmin = 'admin@admin.com';
        const passwordAdmin = 'admin123'; 

        // 1. Verificar si el administrador ya existe
        const adminExists = await User.findOne({ email: emailAdmin });

        if (adminExists) {
            console.log(` Usuario Administrador (${emailAdmin}) ya existe.`);
            mongoose.disconnect();
            return;
        }

        const usuarioAdmin = new User({
              nombre: 'Usuario Administrador',
              email: emailAdmin,
              password: passwordAdmin,
              rol: "admin",
            });

        await usuarioAdmin.save();

        console.log(` Usuario Administrador (${emailAdmin}) creado exitosamente.`);
        
    } catch (error) {
        console.error(` Error al crear usuario admin: ${error.message}`);
    } finally {
        // 4. Desconectar Mongoose después de la siembra
        mongoose.disconnect();
    }
};

crearAdminUser();