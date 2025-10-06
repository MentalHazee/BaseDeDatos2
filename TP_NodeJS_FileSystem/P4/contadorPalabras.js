const fs = require("node:fs").promises;

const [, , nombreArchivo, palabraBuscada] = process.argv;

async function contarPalabras() {
    try {
        // Verifica que hayan pasado ambos argumentos
        if (!nombreArchivo || !palabraBuscada) {
            console.log("Uso: node contarPalabras.js <nombreArchivo> <palabra>");
            return;
        }

        // Lee el contendio del archivo
        const contenido = await fs.readFile(nombreArchivo, "utf-8");

        // Normaliza el texto y la palabra
        const texto = contenido.toLowerCase();
        const palabra = palabraBuscada.toLowerCase();

        // Cuenta cuantas veces aparece la palabra
        const coincidencias = texto.match(new RegExp(`\\b${palabra}\\b`, "g")) || [];
        const cantidad = coincidencias.length;

        // Muestra el resultado
        console.log(`La palabra "${palabraBuscada}" aparece ${cantidad} veces en el archivo "${nombreArchivo}"`);
    
    } catch (error) {
        console.error("Error al leer el archivo: ", error.message);
    }

}

contarPalabras();