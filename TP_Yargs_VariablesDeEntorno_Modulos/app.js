import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { config } from "./config.js";

//Configura yargs para leer los argumentos
/*const argv = yargs(hideBin(process.argv))
    .option('nombre', {
        type: 'string',
        demandOption: true,
        description: 'Julián'
    })
    .option('edad', {
        type: 'number',
        demandOption: true,
        description: '28',
        coerce: (edad) => {
            if (isNaN(edad) || edad <= 0) {
                throw new Error(`La edad debe ser un número mayor que 0`);
            }
            return edad;
        }
    })

console.log(`${argv.nombre} tiene ${argv.edad} años`);*/

//5. Integrador
const argv = yargs(hideBin(process.argv))
    .option("saludo", {
        type:"string",
        demandOption: true,
        describe: "Mensaje de saludo"
    })
    .argv;

console.log(`Servidor corriendo en el puerto ${config.port} (modo ${config.mode}): ${argv.saludo}`);