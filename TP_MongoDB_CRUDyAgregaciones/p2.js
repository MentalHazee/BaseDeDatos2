// EJERCICIO 2 – PLATAFORMA DE CURSOS ONLINE
// -------- PARTE 1: CRUD --------

// Limpiamos las colecciones
db.estudiantes.drop();
db.cursos.drop();

// Insertar cursos
db.cursos.insertMany([
    { titulo: "JavaScript Avanzado", descripcion: "Profundiza en JS moderno" },
    { titulo: "MongoDB para principiantes", descripcion: "Introducción a bases NoSQL" },
    { titulo: "Desarrollo con Node.js", descripcion: "Backend con Node y Express" }
]);

// Guardamos los _id de cada curso
const js = db.cursos.findOne({ titulo: "JavaScript Avanzado" })._id;
const mongo = db.cursos.findOne({ titulo: "MongoDB para principiantes" })._id;
const node = db.cursos.findOne({ titulo: "Desarrollo con Node.js" })._id;

// Insertar estudiantes con relación a cursos
db.estudiantes.insertMany([
    { nombre: "Juan Pérez", email: "juan@example.com", edad: 25, cursos_ids: [js, mongo] },
    { nombre: "Ana Gómez", email: "ana@example.com", edad: 28, cursos_ids: [mongo] },
    { nombre: "Carlos Ruiz", email: "carlos@example.com", edad: 22, cursos_ids: [js, node] },
    { nombre: "Lucía Fernández", email: "lucia@example.com", edad: 30, cursos_ids: [node] }
]);

// -------- READ: cursos con estudiantes --------
print("\n Listado de cursos con estudiantes:\n");
db.cursos.aggregate([
    {
        $lookup: {
            from: "estudiantes",
            localField: "_id",
            foreignField: "cursos_ids",
            as: "estudiantes"
        }
    },
    { $project: { _id: 0, titulo: 1, "estudiantes.nombre": 1 } }
]).pretty();

// -------- UPDATE: actualizar email --------
db.estudiantes.updateOne(
    { nombre: "Ana Gómez" },
    { $set: { email: "ana.gomez@correo.com" } }
);
print("\n Email de Ana Gómez actualizado.\n");

// -------- DELETE: eliminar curso y quitar referencia --------
const cursoEliminar = db.cursos.findOne({ titulo: "MongoDB para principiantes" })._id;
db.cursos.deleteOne({ _id: cursoEliminar });
db.estudiantes.updateMany({}, { $pull: { cursos_ids: cursoEliminar } });
print("\n Curso eliminado y referencias actualizadas.\n");

// -------- PARTE 2: AGREGACIONES --------

// Contar cuántos estudiantes hay por curso
print("\n Cantidad de estudiantes por curso:\n");
db.cursos.aggregate([
    {
        $lookup: {
            from: "estudiantes",
            localField: "_id",
            foreignField: "cursos_ids",
            as: "estudiantes"
        }
    },
    { $project: { titulo: 1, cantidad_estudiantes: { $size: "$estudiantes" } } }
]).pretty();

// Estudiantes con más de un curso
print("\n Estudiantes con más de un curso:\n");
db.estudiantes.aggregate([
    { $project: { nombre: 1, cantidad_cursos: { $size: "$cursos_ids" } } },
    { $match: { cantidad_cursos: { $gt: 1 } } }
]).pretty();
