const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function ejercicio1_tiendaLibros(db) {
  console.log("\n===== EJERCICIO 1 — TIENDA DE LIBROS =====\n");

  const autores = db.collection("autores");
  const libros = db.collection("libros");

  // Clean
  await autores.deleteMany({});
  await libros.deleteMany({});

  // CREATE
  const autoresIds = await autores.insertMany([
    { nombre: "Gabriel García Márquez", fecha_nacimiento: 1927 },
    { nombre: "J. K. Rowling", fecha_nacimiento: 1965 },
    { nombre: "Isaac Asimov", fecha_nacimiento: 1920 }
  ]);

  await libros.insertMany([
    { titulo: "Cien años de soledad", paginas: 417, categorias: ["Realismo mágico"], author_id: autoresIds.insertedIds[0] },
    { titulo: "El amor en los tiempos del cólera", paginas: 348, categorias: ["Romance"], author_id: autoresIds.insertedIds[0] },
    { titulo: "Harry Potter y la piedra filosofal", paginas: 309, categorias: ["Fantasía"], author_id: autoresIds.insertedIds[1] },
    { titulo: "Harry Potter y la cámara secreta", paginas: 341, categorias: ["Fantasía"], author_id: autoresIds.insertedIds[1] },
    { titulo: "Fundación", paginas: 255, categorias: ["Ciencia ficción"], author_id: autoresIds.insertedIds[2] }
  ]);

  // READ + LOOKUP
  console.log(" Libros con autores:");
  console.log(await libros.aggregate([
    { $lookup: { from: "autores", localField: "author_id", foreignField: "_id", as: "autor" } },
    { $project: { titulo: 1, paginas: 1, categorias: 1, "autor.nombre": 1 } }
  ]).toArray());

  // UPDATE
  await libros.updateOne(
    { titulo: "Fundación" },
    { $set: { paginas: 300 } }
  );

  // DELETE (delete author + books)
  const autorAEliminar = autoresIds.insertedIds[0];
  await autores.deleteOne({ _id: autorAEliminar });
  await libros.deleteMany({ author_id: autorAEliminar });

  // AGGREGATIONS
  console.log("\n Promedio de páginas por autor:");
  console.log(await libros.aggregate([
    { $group: { _id: "$author_id", promedioPaginas: { $avg: "$paginas" } } }
  ]).toArray());

  console.log("\n Cantidad de libros por autor:");
  console.log(await libros.aggregate([
    { $group: { _id: "$author_id", cantidadLibros: { $sum: 1 } } }
  ]).toArray());
}

async function ejercicio2_plataformaCursos(db) {
  console.log("\n===== EJERCICIO 2 — PLATAFORMA DE CURSOS =====\n");

  const estudiantes = db.collection("estudiantes");
  const cursos = db.collection("cursos");

  // Clean
  await estudiantes.deleteMany({});
  await cursos.deleteMany({});

  // CREATE
  const estIds = await estudiantes.insertMany([
    { nombre: "Juan Pérez", email: "juanperez@gmail.com", edad: 23 },
    { nombre: "María López", email: "marialopez@gmail.com", edad: 21 },
    { nombre: "Carlos Gómez", email: "carlosgomez@gmail.com", edad: 25 },
    { nombre: "Ana Torres", email: "anatorres@gmail.com", edad: 22 }
  ]);

  await cursos.insertMany([
    { titulo: "Desarrollo Web", descripcion: "HTML, CSS, JS", student_ids: [estIds.insertedIds[0], estIds.insertedIds[1], estIds.insertedIds[2]] },
    { titulo: "Bases de Datos", descripcion: "SQL & NoSQL", student_ids: [estIds.insertedIds[0], estIds.insertedIds[3]] },
    { titulo: "Programación Java", descripcion: "POO", student_ids: [estIds.insertedIds[1], estIds.insertedIds[2]] }
  ]);

  // READ + LOOKUP
  console.log("\n Cursos con estudiantes:");
  console.log(await cursos.aggregate([
    { $lookup: { from: "estudiantes", localField: "student_ids", foreignField: "_id", as: "inscriptos" } },
    { $project: { titulo: 1, "inscriptos.nombre": 1 } }
  ]).toArray());

  // UPDATE
  await estudiantes.updateOne(
    { nombre: "Juan Pérez" },
    { $set: { email: "juan.perez@outlook.com" } }
  );

  // DELETE course
  await cursos.deleteOne({ titulo: "Desarrollo Web" });

  // AGGREGATIONS
  console.log("\n Cantidad de alumnos por curso:");
  console.log(await cursos.aggregate([
    { $project: { titulo: 1, cantidad: { $size: "$student_ids" } } }
  ]).toArray());

  console.log("\n Estudiantes en más de un curso:");
  console.log(await cursos.aggregate([
    { $unwind: "$student_ids" },
    { $group: { _id: "$student_ids", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $lookup: { from: "estudiantes", localField: "_id", foreignField: "_id", as: "estudiante" } },
    { $project: { "estudiante.nombre": 1, count: 1 } }
  ]).toArray());
}

async function main() {
  await client.connect();
  console.log(" Conectado a MongoDB");

  const db1 = client.db("tiendaLibros");
  const db2 = client.db("plataformaCursos");

  await ejercicio1_tiendaLibros(db1);
  await ejercicio2_plataformaCursos(db2);

  await client.close();
  console.log("\n Finalizado correctamente");
}

main();
