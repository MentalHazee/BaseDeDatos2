// Importamos el módulo 'fs' pero en su versión de promesas (fs.promises).
// Node.js trae el módulo 'fs' (File System) para interactuar con el sistema de archivos.
// Con él podemos leer, escribir, crear, modificar y borrar archivos y directorios.
// Al usar 'fs.promises', todas las funciones devuelven Promises y podemos usar 'async/await'.

const fs = require("fs").promises;

// Función para obtener la fecha y hora actual en formato [YYYY-MM-DD HH:MM:SS]
function getDateTime() {

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
    
}

// Función asincrónica que escribe un mensaje en el archivo log.txt
async function logMessage(message) {

    // Armamos el texto que se va a guardar en el archivo
    const logLine = `${getDateTime()} - ${message}\n`; 
    
    // Usamos fs.appendFile para agregar contenido al archivo log.txt.
    // Si el archivo no existe, lo crea automáticamente.
    // Como usamos fs.promises, esto devuelve una Promise y lo esperamos con 'await'.
    try {
        await fs.appendFile("log.txt", logLine, "utf8");
    } catch (err) {
        // Si ocurre algún error (por ejemplo permisos), lo mostramos en consola.
        console.error("Error al escribir en log.txt: ", err);
    }
}

// Función principal que simula el flujo del programa
async function main() {

     // Escribimos el inicio del programa
    await logMessage("Inicio del programa");
    // Simulamos que comienza una tarea
    await logMessage("Ejecutando tarea...");

    // Usamos setTimeout para simular una tarea que tarda 5 segundos.
    // Cuando termina, se escribe "Tarea completada" en el archivo.
    setTimeout(async() => {
        await logMessage("Tarea completada");
    }, 5000);
}

// Llamamos a la función principal
main();