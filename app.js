// ============================================
// 📱 APP PRINCIPAL - Lógica de Pedidos
// ============================================
// Bake Sale Escolar - App para pedidos
// ============================================

// ─── Estado de la aplicación ───
const state = {
  cart: {},              // { itemId: quantity }
  familyName: "",        // Nombre de la familia
  orderNumber: null,     // Número de orden asignado
  submitted: false,      // ¿Ya se confirmó el pedido?
  orders: [],            // Lista de pedidos (dashboard)
};

// ─── Configuración de Firebase ───
// ⚠️ IMPORTANTE: Vamos a configurar esto en el PASO 2
// Por ahora la app funciona con almacenamiento local
const FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};

// ─── Inicialización ───
document.addEventListener("DOMContentLoaded", () => {
  // Cargar el menú
  renderMenu();

  // Restaurar carrito guardado
  loadCart();

  // Configurar el nombre de la familia
  const nameInput = document.getElementById("familyName");
  if (nameInput) {
    nameInput.addEventListener("input", (e) => {
      state.familyName = e.target.value.trim();
      updateCartBar();
    });
  }

  // Cargar Firebase (si está disponible)
  loadFirebase();

  // Mostrar la página principal
  showPage("menu-page");
});

// ─── Renderizar el menú ───
function renderMenu() {
  const savoryGrid = document.getElementById("savory-grid");
  const sweetGrid = document.getElementById("sweet-grid");

  // Solo actualizar si estos elementos existen (página del menú)
  const eventNameEl = document.getElementById("event-name");
  const eventDateEl = document.getElementById("event-date");
  if (eventNameEl) eventNameEl.textContent = MENU.eventName || "🧁 Bake Sale";
  if (eventDateEl) eventDateEl.textContent = MENU.eventDate || "";

  if (savoryGrid) {
    savoryGrid.innerHTML = MENU.savory
      .map((item) => createMenuItem(item))
      .join("");
  }

  if (sweetGrid) {
    sweetGrid.innerHTML = MENU.sweet
      .map((item) => createMenuItem(item))
      .join("");
  }
}

function createMenuItem(item) {
  const qty = state.cart[item.id] || 0;
  const hasOrder = qty > 0 ? "has-order" : "";

  return `
    <div class="menu-card ${hasOrder}" data-id="${item.id}" onclick="toggleItem('${item.id}')">
      <div class="item-badge">${qty}</div>
      <div class="item-emoji">${item.name.split(" ")[0]}</div>
      <div class="item-name">${item.name.replace(/^[\p{Emoji}\s]+/u, "").trim() || item.name}</div>
      <div class="item-price">${formatCurrency(item.price)}</div>
    </div>
  `;
}

// ─── Manejo del carrito ───
function toggleItem(itemId) {
  if (state.submitted) return;

  const current = state.cart[itemId] || 0;
  if (current === 0) {
    state.cart[itemId] = 1;
  } else {
    state.cart[itemId] = current + 1;
  }

  saveCart();
  updateMenuDisplay();
  updateCartBar();
}

function changeQuantity(itemId, delta) {
  if (state.submitted) return;

  const current = state.cart[itemId] || 0;
  const newQty = current + delta;

  if (newQty <= 0) {
    delete state.cart[itemId];
  } else {
    state.cart[itemId] = newQty;
  }

  saveCart();
  updateMenuDisplay();
  updateCartBar();
  renderOrderSummary();
}

function removeItem(itemId) {
  delete state.cart[itemId];
  saveCart();
  updateMenuDisplay();
  updateCartBar();
  renderOrderSummary();
}

function getCartItems() {
  const allItems = [...MENU.savory, ...MENU.sweet];
  return Object.entries(state.cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = allItems.find((i) => i.id === id);
      return { ...item, quantity: qty, total: (item?.price || 0) * qty };
    });
}

function getCartTotal() {
  return getCartItems().reduce((sum, item) => sum + item.total, 0);
}

function getCartCount() {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
}

// ─── Actualizar la interfaz ───
function updateMenuDisplay() {
  document.querySelectorAll(".menu-card").forEach((card) => {
    const id = card.dataset.id;
    const qty = state.cart[id] || 0;
    card.classList.toggle("has-order", qty > 0);
    card.querySelector(".item-badge").textContent = qty;
  });
}

function updateCartBar() {
  const count = getCartCount();
  const total = getCartTotal();
  const bar = document.getElementById("cart-bar");

  if (!bar) return;

  if (count > 0) {
    bar.classList.add("visible");
    document.getElementById("cart-count").textContent =
      `${count} ${count === 1 ? "producto" : "productos"}`;
    document.getElementById("cart-total").textContent = formatCurrency(total);
  } else {
    bar.classList.remove("visible");
  }
}

// ─── Modal de resumen ───
function openOrderModal() {
  if (!state.familyName) {
    showToast("Por favor, ingresá el nombre de la familia", "error");
    document.getElementById("familyName").focus();
    return;
  }

  if (getCartCount() === 0) {
    showToast("Agregá productos al pedido", "error");
    return;
  }

  renderOrderSummary();
  document.getElementById("order-modal").classList.add("open");
}

function closeOrderModal() {
  document.getElementById("order-modal").classList.remove("open");
}

function renderOrderSummary() {
  const container = document.getElementById("order-summary-items");
  const totalEl = document.getElementById("order-summary-total");
  const nameEl = document.getElementById("order-summary-name");

  if (!container) return;

  nameEl.textContent = `Familia: ${state.familyName}`;

  const items = getCartItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:20px;color:var(--text-muted);">
        No hay productos en el pedido
      </div>
    `;
    if (totalEl) totalEl.textContent = formatCurrency(0);
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
      <li class="order-item">
        <div class="item-left">
          <div class="qty-controls">
            <button class="qty-btn ${item.quantity === 1 ? "remove" : ""}"
                    onclick="${item.quantity === 1 ? `removeItem('${item.id}')` : `changeQuantity('${item.id}', -1)`}">
              ${item.quantity === 1 ? "🗑" : "−"}
            </button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
          </div>
          <span class="item-name-modal">${item.name}</span>
        </div>
        <span class="item-total">${formatCurrency(item.total)}</span>
      </li>
    `
    )
    .join("");

  if (totalEl) totalEl.textContent = formatCurrency(getCartTotal());
}

// ─── Confirmar pedido ───
function submitOrder() {
  if (state.submitted) return;

  const items = getCartItems();
  if (items.length === 0 || !state.familyName) return;

  state.submitted = true;
  state.orderNumber = generateOrderNumber();

  const order = {
    number: state.orderNumber,
    family: state.familyName,
    items: items,
    total: getCartTotal(),
    status: "pending",
    timestamp: new Date().toISOString(),
  };

  // Guardar en localStorage como respaldo
  saveOrderLocally(order);

  // Intentar enviar a Firebase
  submitToFirebase(order);

  // Intentar enviar por email (fallback)
  submitByEmail(order);

  // Mostrar confirmación
  showConfirmation(order);
}

function generateOrderNumber() {
  const now = new Date();
  const prefix = String(now.getHours()).padStart(2, "0") +
                 String(now.getMinutes()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `#${prefix}${random}`;
}

// ─── Pantalla de confirmación ───
function showConfirmation(order) {
  document.getElementById("order-modal").classList.remove("open");

  const page = document.getElementById("confirmation-page");
  page.classList.remove("hidden");

  document.getElementById("confirm-order-number").textContent = order.number;
  document.getElementById("confirm-family").textContent = `Familia: ${order.family}`;
  document.getElementById("confirm-total").textContent = `Total: ${formatCurrency(order.total)}`;

  // Lista de items
  const itemsList = document.getElementById("confirm-items");
  itemsList.innerHTML = order.items
    .map((item) => `<li>${item.quantity}x ${item.name}</li>`)
    .join("");

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Ocultar cart bar
  document.getElementById("cart-bar").classList.remove("visible");

  showToast("🎉 Pedido confirmado!", "success");
}

function newOrder() {
  state.cart = {};
  state.familyName = "";
  state.submitted = false;
  state.orderNumber = null;
  saveCart();

  document.getElementById("confirmation-page").classList.add("hidden");
  document.getElementById("menu-page").classList.remove("hidden");
  document.getElementById("familyName").value = "";
  updateMenuDisplay();
  updateCartBar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── Almacenamiento local ───
function saveCart() {
  try {
    localStorage.setItem("bake-sale-cart", JSON.stringify(state.cart));
    localStorage.setItem("bake-sale-family", state.familyName);
  } catch (e) {
    // Si no hay localStorage, no pasa nada
  }
}

function loadCart() {
  try {
    const savedCart = localStorage.getItem("bake-sale-cart");
    const savedFamily = localStorage.getItem("bake-sale-family");

    if (savedCart) {
      state.cart = JSON.parse(savedCart);
    }
    if (savedFamily) {
      state.familyName = savedFamily;
      const nameInput = document.getElementById("familyName");
      if (nameInput) nameInput.value = savedFamily;
    }
  } catch (e) {
    // Ignorar errores de carga
  }
}

function saveOrderLocally(order) {
  try {
    const orders = JSON.parse(localStorage.getItem("bake-sale-orders") || "[]");
    orders.push(order);
    localStorage.setItem("bake-sale-orders", JSON.stringify(orders));
  } catch (e) {
    // Ignorar
  }
}

// ─── Firebase (configuración pendiente) ───
function loadFirebase() {
  // Esto se configura cuando el usuario crea su proyecto Firebase
  // Por ahora la app usa localStorage como fallback
  console.log("📡 Firebase se configurará en el Paso 2");
}

function submitToFirebase(order) {
  // Si Firebase no está configurado, esto se salta silenciosamente
  if (typeof firebase === "undefined") return;

  try {
    firebase
      .firestore()
      .collection("orders")
      .add(order)
      .then(() => console.log("✅ Pedido guardado en Firebase"))
      .catch((err) => console.warn("⚠️ Firebase error:", err));
  } catch (e) {
    console.warn("⚠️ Firebase no disponible");
  }
}

// ─── Email (fallback) ───
function submitByEmail(order) {
  // Podemos configurar FormSubmit.co más adelante
  // Por ahora los pedidos se guardan localmente
  console.log("📧 Email submission disponible en versión final");
}

// ─── Utilidades ───
function formatCurrency(amount) {
  // Formatea el precio en Bolivianos (Bs)
  if (amount === 0) return "Bs —";

  return "Bs " + amount.toLocaleString("es-BO");
}

function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = "toast " + type + " visible";

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, 3000);
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));
  const page = document.getElementById(pageId);
  if (page) page.classList.remove("hidden");
}

// ─── Dashboard Functions ───
// (Estas funciones se usan desde dashboard.html)

function loadDashboardOrders() {
  const container = document.getElementById("dashboard-orders");
  if (!container) return;

  try {
    const localOrders = JSON.parse(
      localStorage.getItem("bake-sale-orders") || "[]"
    );

    if (localOrders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="big-icon">📋</span>
          <h3>No hay pedidos todavía</h3>
          <p>Los pedidos aparecerán aquí cuando las familias confirmen</p>
        </div>
      `;
      updateDashboardStats(localOrders);
      return;
    }

    // Ordenar del más reciente al más antiguo
    localOrders.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    container.innerHTML = localOrders
      .map(
        (order, index) => `
        <div class="order-card" style="animation: fadeInUp 0.3s ease ${index * 0.05}s both;">
          <div class="order-header">
            <div>
              <div class="order-number">${order.number}</div>
              <div class="order-family">👤 ${order.family}</div>
            </div>
            <span class="status-badge status-${order.status}">
              ${getStatusText(order.status)}
            </span>
          </div>
          <div class="order-items-list">
            ${order.items
              .map(
                (item) => `
              <div class="order-item-row">
                <span>${item.quantity}x ${item.name}</span>
                <span>${formatCurrency(item.total)}</span>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="order-total-row">
            <span>Total</span>
            <span>${formatCurrency(order.total)}</span>
          </div>
          <div class="order-time">🕐 ${formatTime(order.timestamp)}</div>
          <div class="order-actions">
            <button class="btn-mark-ready" onclick="updateOrderStatus(${index}, 'ready')">
              ✅ Listo
            </button>
            <button class="btn-mark-delivered" onclick="updateOrderStatus(${index}, 'delivered')">
              📦 Entregado
            </button>
          </div>
        </div>
      `
      )
      .join("");

    updateDashboardStats(localOrders);
  } catch (e) {
    container.innerHTML = `<div class="empty-state">Error al cargar pedidos</div>`;
  }
}

function updateOrderStatus(index, newStatus) {
  try {
    const orders = JSON.parse(localStorage.getItem("bake-sale-orders") || "[]");
    if (orders[index]) {
      orders[index].status = newStatus;
      localStorage.setItem("bake-sale-orders", JSON.stringify(orders));
      loadDashboardOrders();
      showToast("Estado actualizado ✅", "success");
    }
  } catch (e) {
    showToast("Error al actualizar", "error");
  }
}

function getStatusText(status) {
  const map = {
    pending: "⏳ Pendiente",
    ready: "✅ Listo",
    delivered: "📦 Entregado",
  };
  return map[status] || status;
}

function formatTime(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  } catch {
    return "";
  }
}

function updateDashboardStats(orders) {
  const totalEl = document.getElementById("stat-total");
  const pendingEl = document.getElementById("stat-pending");
  const revenueEl = document.getElementById("stat-revenue");

  if (totalEl) totalEl.textContent = orders.length;
  if (pendingEl)
    pendingEl.textContent = orders.filter((o) => o.status === "pending").length;
  if (revenueEl)
    revenueEl.textContent = formatCurrency(
      orders.reduce((sum, o) => sum + (o.total || 0), 0)
    );
}

// ─── Exportar pedidos ───
function exportOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem("bake-sale-orders") || "[]");

    if (orders.length === 0) {
      showToast("No hay pedidos para exportar", "error");
      return;
    }

    // Crear resumen
    let text = "🧁 BAKE SALE - RESUMEN DE PEDIDOS\n";
    text += "═══════════════════════════════\n\n";

    // Agrupar por producto (para saber qué cocinar)
    const allItems = [...MENU.savory, ...MENU.sweet];
    const summary = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.id || item.name;
        if (!summary[key]) {
          summary[key] = { name: item.name, quantity: 0, total: 0 };
        }
        summary[key].quantity += item.quantity;
        summary[key].total += item.total;
      });
    });

    text += "📋 QUÉ COCINAR (TOTAL POR PRODUCTO):\n";
    text += "──────────────────────────────────\n";
    Object.values(summary).forEach((item) => {
      text += `${item.quantity}x ${item.name}\n`;
    });

    text += "\n📦 PEDIDOS POR FAMILIA:\n";
    text += "──────────────────────\n";
    orders.forEach((order) => {
      text += `\n${order.number} - ${order.family} [${getStatusText(order.status)}]\n`;
      order.items.forEach((item) => {
        text += `   ${item.quantity}x ${item.name} = ${formatCurrency(item.total)}\n`;
      });
      text += `   TOTAL: ${formatCurrency(order.total)}\n`;
    });

    // Descargar como archivo de texto
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bake-sale-pedidos-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showToast("📥 Pedidos exportados!", "success");
  } catch (e) {
    showToast("Error al exportar", "error");
  }
}

// ─── Limpiar pedidos ───
function clearAllOrders() {
  if (!confirm("¿Estás seguro? Esto eliminará TODOS los pedidos.")) return;

  localStorage.removeItem("bake-sale-orders");
  loadDashboardOrders();
  showToast("Pedidos eliminados", "info");
}
