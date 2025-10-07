const fs = require("node:fs").promises;

const [,, archivoOrigen, archivoDestino] = process.argv;

if (!archivoOrigen || !archivoDestino) {
    console.log("Uso correcto: node copiarArchivo.js <archivoOrigen> <archivoDestino>");
    process.exit(1);
}

async function copiarArchivo() {
    try {
        await fs.access(archivoOrigen);
        const contenido = await fs.readFile(archivoOrigen, "utf-8");
        await fs.writeFile(archivoDestino, contenido, "utf-8");
        console.log(`Archivo copiado correctamente de "${archivoOrigen}" a "${archivoDestino}"`);
    } catch (err) {
        if (err.code === "ENOENT") {
            console.error(`Error: el archivo "${archivoOrigen}" no existe`);
        } else {
            console.error("Error al copiar el arvhivo: ", err);
        }
    }
}

copiarArchivo();