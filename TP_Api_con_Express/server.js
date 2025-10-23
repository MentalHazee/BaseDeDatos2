// Importar Express y crear la app
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware global para registrar información de cada petición
app.use((req, res, next) => {
    const fechaHora = new Date().toLocaleString();
    const metodo = req.method;
    const url = req.originalUrl;
    const ip = req.ip;

    console.log(`[${fechaHora}] ${metodo} ${url} - IP: ${ip}`);
    next(); // Continua hacia la siguiente función o ruta
});

// Ruta raíz: mensaje de bienvenida
app.get('/', (req, res) => {
    res.send('Bienvenido a la API del ejercicio con Express');
});

// Ruta /saludo/:nombre → devuelve un saludo personalizado
app.get('/saludo/:nombre', (req, res) => {
    const { nombre } = req.params;
    res.status(200).send(`Hola, ${nombre}`);
});

// Ruta /suma → recibe num1 y num2 por query y devuelve la suma
app.get('/suma', (req, res) => {
    const { num1, num2 } = req.query;

    // Validar que ambos parámetros existan y sean números
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        return res.status(400).send('Error: Debe enviar los parámetros num1 y num2 numéricos.');
    }

    const resultado = Number(num1) + Number(num2);
    res.status(200).send(`La suma de ${num1} + ${num2} es ${resultado}`);
});

// Ruta /fecha → devuelve la fecha actual del servidor
app.get('/fecha', (req, res) => {
    const fechaActual = new Date().toLocaleDateString();
    res.status(200).send(`Fecha actual: ${fechaActual}`);
});

// Middleware para manejar rutas no existentes (404)
app.use((req, res) => {
    res.status(404).send('Error 404: Ruta no encontrada');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


/* ----------------------------------------------- */


// Contador de peticiones (middleware global)
let contador = 0;

// Middleware global: contar cantidad de peticiones
app.use((req, res, next) => {
    contador++;
    console.log(`Cantidad de peticiones recibidas: ${contador}`);
    next(); // Continua hacia la siguiente función o ruta
});

// Middleware local: validar edad
const validarEdad = (req, res, next) => {
    const { edad } = req.query;

    // Verificar que el parámetro exista y sea un número
    if (!edad || isNaN(edad) || Number(edad) < 18) {
        return res.status(400).send("Acceso denegado");
    }

    // Si es válido, continuar con la ruta
    next();
};

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a la API del TP N°2');
});

// Ruta /edad con middleware local validarEdad
app.get('/edad', validarEdad, (req, res) => {
    res.send("Acceso permitido");
});

// Ruta /producto/:id → recibe un id como parámetro en la URL
app.get('/producto/:id', (req, res) => {
    const { id } = req.params;

    // Verificar que el id sea numérico
    if (isNaN(id)) {
        return res.status(400).send("El ID debe ser un número válido");
    }

    res.status(200).send(`Producto con ID: ${id}`);
});

// Ruta /promedio → recibe tres notas por query y calcula el promedio
app.get('/promedio', (req, res) => {
    const { n1, n2, n3 } = req.query;

    // Validar que existan las tres notas y sean números
    if (!n1 || !n2 || !n3 || isNaN(n1) || isNaN(n2) || isNaN(n3)) {
        return res.status(400).send("Debe ingresar tres notas numéricas (n1, n2, n3)");
    }

    const promedio = (Number(n1) + Number(n2) + Number(n3)) / 3;
    res.status(200).send(`El promedio es: ${promedio.toFixed(2)}`);
});

// Ruta /hora → devuelve la hora actual del servidor
app.get('/hora', (req, res) => {
    const horaActual = new Date().toLocaleTimeString();
    res.status(200).send(`Hora actual del servidor: ${horaActual}`);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
