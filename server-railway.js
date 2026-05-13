// ============================================
// 🚂 Servidor Express para Railway
// ============================================
// Sirve los archivos estáticos de la app
// ============================================

const express = require("express");
const path = require("path");
const app = express();

// Puerto: Railway lo asigna automáticamente
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta raíz
app.use(express.static(path.join(__dirname)));

// SPA fallback: si no encuentra el archivo, sirve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🧁 Bake Sale App corriendo en puerto ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard.html`);
});