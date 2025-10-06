const fs = require("node:fs").promises;

const archivo = "contactos.json";

// Función para leer los contactos
async function leerContactos() {
    try {
        const data = await fs.readFile(archivo, "utf-8");
        return JSON.parse(data); // Transforma el JSON en un arreglo JS
    } catch (err) {
        if (err.code == "ENOENT") {
            return []; // Si el archivo no existe, devolvemos un arreglo vacío
        } else {
            console.error("Error al leer los contactos: ", err);
        }
    }
}

// Función para guardar los contactos en el archivo
async function guardarContactos(contactos) {
    try {
        await fs.writeFile(archivo, JSON.stringify(contactos, null, 2), "utf-8");
    } catch (err) {
        console.error("Error al guardar los contactos: ", err);
    }
}

// 1. Agregar un nuevo contacto
async function agregarContacto(nombre, telefono, email) {
    const contactos = await leerContactos();
    const nuevoContacto = { nombre, telefono, email };
    contactos.push(nuevoContacto);
    await guardarContactos(contactos);
    console.log(`Contacto agregado: ${nombre}`);
}

// 2. Mostrar todos los contactos
async function mostrarContactos() {
    const contactos = await leerContactos();
    if (contactos.length === 0) {
        console.log("No hay contactos guardados");
        contactos.forEach((c, i) => {
            console.log(`${i + 1}. ${c.nombre} - ${c.telefono} - ${c.email}`);
        });
    }
}

// 3. Eliminar un contacto
async function eliminarContacto(nombre) {
    const contactos = await leerContactos();
    const nuevosContactos = contactos.filter(c => c.nombre !== nombre);
    if (nuevosContactos.length === contactos.length) {
        console.log(`No se encontró ningún contacto con el nombre "${nombre}"`);
    } else {
        await guardarContactos(nuevosContactos);
        console.log(`Contacto eliminado: ${nombre}`);
    }
}

// Código de prueba
(async () => {
    await agregarContacto("Lucas Orton", "2615986335", "lucas@orton.com");
    await mostrarContactos();

    await eliminarContacto("Juan Pérez");
    await mostrarContactos();
}) ();