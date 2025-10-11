import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "node:fs";
import { suma, resta, multiplicacion, division } from "./math.js";

yargs(hideBin(process.argv))
    //Comando SALUDAR
    .command(
        "saludar",
        "Saluda a una persona",
        (yargs) => {
            return yargs.option("nombre", {
                alias: "n",
                type: "string",
                demandOption: true,
                describe: "Nombre de la persona a saludar",
            });
        },
        (argv) => {
            console.log(`Hola ${argv.nombre}`);
        }
    )

    //Comando DESPEDIR
    .command(
        "despedir",
        "Despedirse de una persona",
        (yargs) => {
            return yargs.option("nombre", {
                alias: "n",
                type: "string",
                demandOption: true,
                describe: "Nombre de la persona a despedir",
            });
        },
        (argv) => {
            console.log(`Chau ${argv.nombre}`);
        }
    )

    //Comando CALCULAR
    .command(
        "calcular",
        "Realizar una operación matemática",
        (yargs) => {
            return yargs
                .option("operacion", {
                    alias: "o",
                    type: "string",
                    demandOption: true,
                    describe: "Operación suma, resta, multiplicación, división",
                })
                .option("n1", {
                    type: "number",
                    demandOption: true,
                    describe: "Primer número",
                })
                .option("n2", {
                    type: "number",
                    demandOption: true,
                    describe: "Segundo número",
                });
        },
        (argv) => {
            try {
                let resultado;
                switch (argv.operacion) {
                    case "suma":
                        resultado = suma(argv.n1, argv.n2);
                        break;
                    case "resta":
                        resultado = resta(argv.n1, argv.n2);
                        break;
                    case "multiplicacion":
                        resultado = multiplicacion(argv.n1, argv.n2);
                        break;
                    case "division":
                        resultado = division(argv.n1, argv.n2);
                        break;
                    default:
                        throw new Error("Operación no válida");
                }
                console.log(`Resultado: ${resultado}`);
            } catch (error) {
                console.log(`Error: ${error.message}`);
            }
        }
    )

    //Comando LEER-JSON
    .command(
        "leer-json",
        "Lee y muestra el contenido de un archivo JSON",
        (yargs) => {
            return yargs.option("archivo", {
                alias: "a",
                type: "string",
                demandOption: true,
                describe: "Ruta del archivo JSON",
            });
        },
        (argv) => {
            try {
                const contenido = fs.readFileSync(argv.archivo, "utf-8");
                const data = JSON.parse(contenido);
                console.log("Contenido del JSON: ");
                console.log(data);
            } catch (error) {
                console.error("Error al leer el archivo JSON: ", error.message);
            }
        }
    )

    .demandCommand(1, "Debes especificar un comando válido")
    .help().argv;


