// ============================================
// 🚀 SERVIDOR LOCAL - Para probar la app
// ============================================
// Servidor simple de archivos estáticos con Node.js
// 
// USO: 
//   1. Abrí tu terminal
//   2. Escribí: node server.js
//   3. Abrí http://localhost:3000 en tu navegador
// ============================================

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

// Tipos MIME para cada extensión
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  // Ruta del archivo solicitado
  let filePath = path.join(PUBLIC_DIR, req.url === "/" ? "index.html" : req.url);

  // Seguridad: evitar que salgan de la carpeta del proyecto
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Acceso denegado");
    return;
  }

  // Obtener extensión
  const ext = path.extname(filePath).toLowerCase();

  // Leer y servir el archivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Si el archivo no existe
      if (err.code === "ENOENT") {
        // Para SPA: servir index.html si no se encuentra el archivo
        fs.readFile(path.join(PUBLIC_DIR, "index.html"), (err2, content2) => {
          if (err2) {
            res.writeHead(500);
            res.end("Error del servidor");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(content2, "utf-8");
        });
      } else {
        res.writeHead(500);
        res.end("Error del servidor: " + err.code);
      }
      return;
    }

    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(content, "utf-8");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("╔══════════════════════════════════════╗");
  console.log("║  🧁 BAKE SALE - Servidor Local 🚀   ║");
  console.log("╠══════════════════════════════════════╣");
  console.log(`║  📍 http://localhost:${PORT}            ║`);
  console.log(`║  📊 http://localhost:${PORT}/dashboard.html ║`);
  console.log("╠══════════════════════════════════════╣");
  console.log("║  Presioná CTRL+C para detener        ║");
  console.log("╚══════════════════════════════════════╝");
  console.log("");
});
