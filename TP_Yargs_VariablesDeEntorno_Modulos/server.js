import {config} from "dotenv"
config()

//Carga variables de entorno
const PORT = process.env.PORT;
const MODE = process.env.MODE;

console.log(`Servidor iniciado en el puerto ${PORT} en modo ${MODE}`);