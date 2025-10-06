const fs = require("node:fs").promises;

function getDataTime() {

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

}

async function main() {
    try {
        //1. Se crea el archivo datos.txt y se escribe en él
        const contenido = `Nombre: Julian Santos\nEdad: 28\nCarrera: Programación\n`;
        await fs.writeFile("datos.txt", contenido, { encoding: "utf8" });
        console.log("Archivo datos.txt creado correctamente");

        //2. Leer el archivo datos.txt e imprime en consola
        const data = await fs.readFile("datos.txt", { encoding: "utf8" });
        console.log("Contenido de datos.txt: ");
        console.log(data);

        //3. Agrega fecha y hora de modificación
        const fecha = `Fecha de modificación: ${getDataTime()}\n`;
        await fs.appendFile("datos.txt", fecha, { encoding: "utf8" });
        console.log("Fecha y hora agregadas correctamente");

        //4. Renombra el archivo a "informacion.txt"
        await fs.rename("datos.txt", "informacion.txt");
        console.log("Archivo renombrado correctamente");

        //5. Eliminar informacion.txt después de 10 segundos
        setTimeout(async () => {
            try {
                await fs.unlink("informacion.txt");
                console.log("Archivo informacion.txt eliminado correctamente");
            } catch (err) {
                console.error("Error al eliminar el archivo: ", err);
            }
        }, 10000);
    } catch (err) {
        console.log("Ocurrió un error: ", err);
    }
}

main();