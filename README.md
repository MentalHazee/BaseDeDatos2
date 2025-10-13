13.10 Código HTTP

    Códigos de los servidores (1xx, 2xx, 3xx, 4xx, 5xx)
    EXPRESS es un framework de backend Node.js con herramientas  

    - Iniciar npm init -y para que se creen las carpetas node_modules, package-lock.json y package.json
    - Crear el index.js
    
    index.js:
      import http from "http";
      const server = http.createServer((req, res) => {
        if (req.url === "/") {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("Bienvenido al servidor http");
        } else if (req.url === "/json") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ mensaje: "hola mundo json" }));
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Ruta no encontrada");
        }
      });      
      server.listen(3000, "127.0.0.1", () => {
        console.log("Servidor a la escucha en http://127.0.0.1:3000");
      });

      *para ejecutar, entrar al localhost o http://127.0.0.1:3000/ muestra mensaje de bienvenida y http://127.0.0.1:3000/json devuelve el JSON
      
      --------------------
      
      *importar Express con "npm install express"
      
      index.js:
        import express from 'express';
        import path from "path";
        import { fileURLToPath } from "url";
        export const app = express();
        const _dirname = path.dirname(fileURLToPath(import.meta.url));
        console.log(_dirname);
        app.get("/front", (req, res) => {
            res.status(200).sendFile(path.join(_dirname, "prueba.html"));
        });
        const middleware =(req, res, next) => {
          console.log(`${req.method} ${req.url}`);
          next();
        };
        app.get("/", middleware, (req, res) => {
            console.log("dentro del get");
            res.status(200).send("hola mundo");
        });   
        app.listen(3000, () => {
          console.log("Servidor ejecutando en la línea 3000");
        });
        app.get("/user/:id", (req, res) => {
            console.log(`Usando el id por parametro ${req.params.id}`);
            res.status(200).send("User: ", req.params.id); //res.status(200).send(`User: ${req.params.id}`);
        });

