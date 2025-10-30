// EJERCICIO 1 – TIENDA DE LIBROS
// -------- PARTE 1: CRUD --------

// Limpiamos las colecciones por si ya existen
db.autores.drop();
db.libros.drop();

// Insertar autores
db.autores.insertMany([
    { nombre: "Gabriel García Márquez", fecha_nacimiento: 1927 },
    { nombre: "J.K. Rowling", fecha_nacimiento: 1965 },
    { nombre: "Isaac Asimov", fecha_nacimiento: 1920 }
]);

// Guardamos los _id de cada autor
const garcia = db.autores.findOne({ nombre: "Gabriel García Márquez" })._id;
const rowling = db.autores.findOne({ nombre: "J.K. Rowling" })._id;
const asimov = db.autores.findOne({ nombre: "Isaac Asimov" })._id;

// Insertar libros
db.libros.insertMany([
    { titulo: "Cien años de soledad", paginas: 417, categorias: ["Realismo mágico"], author_id: garcia },
    { titulo: "El amor en los tiempos del cólera", paginas: 348, categorias: ["Romance"], author_id: garcia },
    { titulo: "Harry Potter y la piedra filosofal", paginas: 309, categorias: ["Fantasía"], author_id: rowling },
    { titulo: "Harry Potter y la cámara secreta", paginas: 341, categorias: ["Fantasía"], author_id: rowling },
    { titulo: "Fundación", paginas: 255, categorias: ["Ciencia ficción"], author_id: asimov }
]);


// -------- Listar libros con nombre de autor --------
print("\n Listado de libros con sus autores:\n");
db.libros.aggregate([
    {
        $lookup: {
            from: "autores",
            localField: "author_id",
            foreignField: "_id",
            as: "autor"
        }
    },
    { $unwind: "$autor" },
    { $project: { _id: 0, titulo: 1, paginas: 1, "autor.nombre": 1 } }
]).pretty();


// -------- UPDATE: actualizar páginas de un libro --------
db.libros.updateOne(
    { titulo: "Fundación" },
    { $set: { paginas: 300 } }
);
print("\n Libro 'Fundación' actualizado.\n");


// -------- DELETE: eliminar autor y sus libros --------
const autorAEliminar = db.autores.findOne({ nombre: "Gabriel García Márquez" })._id;
db.autores.deleteOne({ _id: autorAEliminar });
db.libros.deleteMany({ author_id: autorAEliminar });
print("\n Autor Gabriel García Márquez y sus libros eliminados.\n");


// -------- PARTE 2: AGREGACIONES --------

// Promedio de páginas por autor
print("\n Promedio de páginas por autor:\n");
db.libros.aggregate([
    {
        $lookup: {
            from: "autores",
            localField: "author_id",
            foreignField: "_id",
            as: "autor"
        }
    },
    { $unwind: "$autor" },
    {
        $group: {
            _id: "$autor.nombre",
            promedio_paginas: { $avg: "$paginas" }
        }
    }
]).pretty();

// Cantidad de libros por autor
print("\n Cantidad de libros por autor:\n");
db.libros.aggregate([
    {
        $lookup: {
            from: "autores",
            localField: "author_id",
            foreignField: "_id",
            as: "autor"
        }
    },
    { $unwind: "$autor" },
    {
        $group: {
            _id: "$autor.nombre",
            cantidad_libros: { $sum: 1 }
        }
    }
]).pretty();
