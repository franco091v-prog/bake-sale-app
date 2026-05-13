// ============================================
// 🍽️ DATOS DEL MENÚ - Bake Sale Escolar
// ============================================
// 👆 ¡EDITA AQUÍ los productos y precios!
//    Cambia los nombres, precios o agrega más.
//    No te preocupes por romper nada :)
// ============================================

const MENU = {
  // ─── Nombre del evento ───
  eventName: "🧁 Bake Sale 2026",
  eventDate: "Sábado 16 de Mayo",
  schoolName: "Escuela",

  // ─── Moneda ───
  // Cambia "Bs" por "$", "S/", "Q", etc. según tu país
  currencySymbol: "Bs",

  // ─── Menú Salado ───
  savory: [
    { id: "s1", name: "🥪 Sándwich de milanesa de pollo", price: 18, category: "salado" },
    { id: "s2", name: "🥪 Sándwich mixto con pollo",     price: 15, category: "salado" },
    { id: "s3", name: "🌮 Salteña",                       price: 12, category: "salado" },
    { id: "s4", name: "🌭 Panchito",                      price: 10, category: "salado" },
    { id: "s5", name: "🥤 Gaseosas, jugos y aguas",       price: 5,  category: "salado" },
  ],

  // ─── Menú Dulce ───
  sweet: [
    { id: "d1", name: "🍫 Brownie",                       price: 10, category: "dulce" },
    { id: "d2", name: "🧀 Empanada de queso",             price: 5,  category: "dulce" },
    { id: "d3", name: "🧁 Cupcake de vainilla",           price: 10, category: "dulce" },
    { id: "d4", name: "🍪 Galleta surtida",               price: 8,  category: "dulce" },
    { id: "d5", name: "🍩 Donuts de vainilla",            price: 8,  category: "dulce" },
    { id: "d6", name: "🌯 Churros",                       price: 8,  category: "dulce" },
    { id: "d7", name: "☕ Café instantáneo",              price: 6,  category: "dulce" },
    { id: "d8", name: "🍵 Té",                            price: 4,  category: "dulce" },
  ],

  // ─── Número de WhatsApp para consultas (opcional) ───
  whatsapp: "",
};

// ⚠️ IMPORTANTE: Pon los precios arriba (reemplaza los 0)
// Ejemplo: price: 1500 (si son pesos argentinos)
// Los precios ya están listos con Bs (Bolivianos)