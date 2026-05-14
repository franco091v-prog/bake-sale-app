// ============================================
// 🚂 Servidor Express para Railway
// ============================================
// Sirve archivos estáticos + API de pedidos
// ============================================

const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 3000;

// Para leer JSON del cuerpo de las peticiones
app.use(express.json({ limit: "1mb" }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// ─── Almacenamiento de pedidos ───
// Se guardan en un archivo JSON para persistencia
const DATA_FILE = path.join(__dirname, "pedidos.json");

function leerPedidos() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error leyendo pedidos:", e.message);
  }
  return [];
}

function guardarPedidos(pedidos) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(pedidos, null, 2), "utf-8");
  } catch (e) {
    console.error("Error guardando pedidos:", e.message);
  }
}

// ─── API: Obtener todos los pedidos ───
app.get("/api/orders", (req, res) => {
  const pedidos = leerPedidos();
  res.json({ success: true, orders: pedidos });
});

// ─── API: Crear un nuevo pedido ───
app.post("/api/orders", (req, res) => {
  const order = req.body;

  // Validar datos mínimos
  if (!order || !order.family || !order.items || order.items.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Faltan datos del pedido (nombre de familia y productos)",
    });
  }

  const pedidos = leerPedidos();
  pedidos.push({
    ...order,
    id: Date.now(),          // ID único
    serverTimestamp: new Date().toISOString(),
    status: "pending",
  });
  guardarPedidos(pedidos);

  console.log(`📦 Nuevo pedido: ${order.number} - ${order.family}`);
  res.json({ success: true, message: "Pedido recibido" });
});

// ─── API: Actualizar estado de un pedido ───
app.put("/api/orders/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const pedidos = leerPedidos();
  const index = pedidos.findIndex((o) => o.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: "Pedido no encontrado" });
  }

  pedidos[index].status = status || "pending";
  guardarPedidos(pedidos);
  res.json({ success: true });
});

// ─── API: Eliminar todos los pedidos ───
app.delete("/api/orders", (req, res) => {
  guardarPedidos([]);
  res.json({ success: true, message: "Pedidos eliminados" });
});

// ─── API: Obtener resumen para cocina ───
app.get("/api/orders/summary", (req, res) => {
  const pedidos = leerPedidos();
  const resumen = {};

  pedidos.forEach((order) => {
    if (order.status === "delivered") return;
    order.items.forEach((item) => {
      const key = item.id || item.name;
      if (!resumen[key]) {
        resumen[key] = { name: item.name, quantity: 0, total: 0 };
      }
      resumen[key].quantity += item.quantity;
      resumen[key].total += item.total;
    });
  });

  res.json({ success: true, summary: Object.values(resumen) });
});

// ─── Fallback: para rutas no encontradas ───
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🧁 Bake Sale App corriendo en puerto ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`📦 Pedidos guardados en: ${DATA_FILE}`);
});
