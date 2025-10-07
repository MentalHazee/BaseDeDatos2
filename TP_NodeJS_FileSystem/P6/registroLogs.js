// Importamos el módulo fs con soporte de promesas
const fs = require("fs").promises;
const path = require("path");

// Definimos la ruta del directorio y del archivo
const directorio = path.join(__dirname, "logs");
const archivoLog = path.join(directorio, "app.log");

// Función para obtener fecha y hora actual formateada
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

// Función para registrar una ejecución exitosa
async function registrarEjecucion() {
  try {

    await fs.mkdir(directorio, { recursive: true });

    const mensaje = `${getDateTime()} - Ejecución exitosa\n`;

    await fs.appendFile(archivoLog, mensaje, "utf8");

    console.log("Ejecución registrada correctamente en app.log");
  } catch (err) {
    console.error("Error al registrar la ejecución:", err);
  }
}

// Función para leer y mostrar las últimas 5 ejecuciones
async function mostrarUltimasEjecuciones() {
  try {

    const data = await fs.readFile(archivoLog, "utf8");

    const lineas = data.trim().split("\n").filter(l => l.length > 0);

    const ultimas = lineas.slice(-5);

    console.log("\nÚltimas 5 ejecuciones registradas:");
    ultimas.forEach(linea => console.log(linea));
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("No hay registros aún. Ejecutá el programa al menos una vez.");
    } else {
      console.error("Error al leer el archivo de logs:", err);
    }
  }
}

async function main() {
  await registrarEjecucion();
  await mostrarUltimasEjecuciones();
}

main();
