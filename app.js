// ============================================
// 📱 APP PRINCIPAL - Lógica de Pedidos
// ============================================
// Bake Sale Escolar - App para pedidos
// ============================================

// ─── URL base de la API ───
// Detecta automáticamente si estamos en Railway o local
const API_BASE = window.location.origin;

// ─── Estado de la aplicación ───
const state = {
  cart: {},
  familyName: "",
  orderNumber: null,
  submitted: false,
  orders: [],
  familyPhone: "",
};

// ─── Inicialización ───
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  loadCart();

  const nameInput = document.getElementById("familyName");
  if (nameInput) {
    nameInput.addEventListener("input", (e) => {
      state.familyName = e.target.value.trim();
      saveCart();
    });
  }

  // Registrar Service Worker para modo offline
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  // Mostrar la página principal
  showPage("menu-page");
});

// ─── Renderizar el menú ───
function renderMenu() {
  const savoryGrid = document.getElementById("savory-grid");
  const sweetGrid = document.getElementById("sweet-grid");

  const eventNameEl = document.getElementById("event-name");
  const eventDateEl = document.getElementById("event-date");
  if (eventNameEl) eventNameEl.textContent = MENU.eventName || "🧁 Bake Sale";
  if (eventDateEl) eventDateEl.textContent = MENU.eventDate || "";

  if (savoryGrid) {
    savoryGrid.innerHTML = MENU.savory.map((item) => createMenuItem(item)).join("");
  }
  if (sweetGrid) {
    sweetGrid.innerHTML = MENU.sweet.map((item) => createMenuItem(item)).join("");
  }
}

function createMenuItem(item) {
  const qty = state.cart[item.id] || 0;
  const hasOrder = qty > 0 ? "has-order" : "";

  return `
    <div class="menu-card ${hasOrder}" data-id="${item.id}" onclick="toggleItem('${item.id}')">
      <div class="item-badge">${qty}</div>
      <div class="item-emoji">${item.name.split(" ")[0]}</div>
      <div class="item-name">${item.name.replace(/^[^\p{L}\p{N}]+/u, "").trim() || item.name}</div>
      <div class="item-price">${formatPrice(item.price)}</div>
    </div>
  `;
}

// ─── Formato de precios ───
function formatPrice(amount) {
  if (amount === 0 || amount == null) return "—";
  return "Bs " + Number(amount).toLocaleString("es-BO");
}

// ─── Manejo del carrito ───
function toggleItem(itemId) {
  if (state.submitted) return;

  const current = state.cart[itemId] || 0;
  state.cart[itemId] = current + 1;

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
      return {
        id: item?.id || id,
        name: item?.name || id,
        price: item?.price || 0,
        quantity: qty,
        total: (item?.price || 0) * qty,
      };
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
    document.getElementById("cart-total").textContent = formatPrice(total);
  } else {
    bar.classList.remove("visible");
  }
}

// ─── Modal de resumen ───
function openOrderModal() {
  if (!state.familyName) {
    showToast("👤 Por favor, ingresá el nombre de la familia", "error");
    document.getElementById("familyName").focus();
    return;
  }

  if (getCartCount() === 0) {
    showToast("🍽️ Agregá productos al pedido", "error");
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
    container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);">No hay productos en el pedido</div>`;
    if (totalEl) totalEl.textContent = formatPrice(0);
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
        <span class="item-total">${formatPrice(item.total)}</span>
      </li>
    `
    )
    .join("");

  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());
}

// ─── Confirmar pedido ───
async function submitOrder() {
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

  // Guardar localmente (respaldo)
  saveOrderLocally(order);

  // Enviar al servidor (Railway)
  const serverOk = await submitOrderToServer(order);

  if (!serverOk) {
    // Si falló el envío al servidor, lo guardamos en localStorage
    // para reintentar después
    queueOrderForRetry(order);
    showToast("📡 Pedido guardado localmente. Se sincronizará después.", "info");
  } else {
    showToast("🎉 Pedido confirmado!", "success");
  }

  // Mostrar confirmación
  showConfirmation(order, serverOk);
}

function generateOrderNumber() {
  const now = new Date();
  const prefix =
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `#${prefix}${random}`;
}

// ─── Enviar pedido al servidor ───
async function submitOrderToServer(order) {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    const data = await res.json();
    return data.success === true;
  } catch (e) {
    console.warn("⚠️ No se pudo enviar al servidor:", e.message);
    return false;
  }
}

// ─── Pedidos pendientes de sincronizar ───
function queueOrderForRetry(order) {
  try {
    const queue = JSON.parse(localStorage.getItem("bake-sale-pending") || "[]");
    queue.push(order);
    localStorage.setItem("bake-sale-pending", JSON.stringify(queue));
  } catch (e) {
    // Ignorar
  }
}

async function retryPendingOrders() {
  try {
    const queue = JSON.parse(localStorage.getItem("bake-sale-pending") || "[]");
    if (queue.length === 0) return;

    const remaining = [];
    for (const order of queue) {
      const ok = await submitOrderToServer(order);
      if (!ok) remaining.push(order);
    }

    if (remaining.length === 0) {
      localStorage.removeItem("bake-sale-pending");
    } else {
      localStorage.setItem("bake-sale-pending", JSON.stringify(remaining));
    }
  } catch (e) {
    // Ignorar
  }
}

// ─── Pantalla de confirmación ───
function showConfirmation(order, serverOk) {
  document.getElementById("order-modal").classList.remove("open");

  const page = document.getElementById("confirmation-page");
  page.classList.remove("hidden");

  document.getElementById("confirm-order-number").textContent = order.number;
  document.getElementById("confirm-family").textContent = `Familia: ${order.family}`;
  document.getElementById("confirm-total").textContent = `Total: ${formatPrice(order.total)}`;

  const itemsList = document.getElementById("confirm-items");
  itemsList.innerHTML = order.items
    .map((item) => `<li>${item.quantity}x ${item.name}</li>`)
    .join("");

  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("cart-bar").classList.remove("visible");
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

// ─── Almacenamiento local (respaldo) ───
function saveCart() {
  try {
    localStorage.setItem("bake-sale-cart", JSON.stringify(state.cart));
    localStorage.setItem("bake-sale-family", state.familyName);
  } catch (e) {
    // Ignorar
  }
}

function loadCart() {
  try {
    const savedCart = localStorage.getItem("bake-sale-cart");
    const savedFamily = localStorage.getItem("bake-sale-family");
    if (savedCart) state.cart = JSON.parse(savedCart);
    if (savedFamily) {
      state.familyName = savedFamily;
      const nameInput = document.getElementById("familyName");
      if (nameInput) nameInput.value = savedFamily;
    }
  } catch (e) {
    // Ignorar
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

// ─── Toast ───
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

// ─── ─── ─── ─── ─── ─── ───
// 📊 FUNCIONES DEL DASHBOARD
// ─── ─── ─── ─── ─── ─── ───

async function loadDashboardOrders() {
  const container = document.getElementById("dashboard-orders");
  if (!container) return;

  try {
    // Intentar obtener pedidos del servidor
    const res = await fetch(`${API_BASE}/api/orders`);
    const data = await res.json();

    if (data.success && data.orders.length > 0) {
      state.orders = data.orders;
      renderDashboardOrders(data.orders);
      renderKitchenSummary(data.orders);
      updateDashboardStats(data.orders);
    } else {
      // Fallback: pedidos locales
      const localOrders = JSON.parse(
        localStorage.getItem("bake-sale-orders") || "[]"
      );
      if (localOrders.length > 0) {
        renderDashboardOrders(localOrders);
        renderKitchenSummary(localOrders);
        updateDashboardStats(localOrders);
      } else {
        container.innerHTML = `
          <div class="empty-state">
            <span class="big-icon">📋</span>
            <h3>No hay pedidos todavía</h3>
            <p>Los pedidos aparecerán aquí cuando las familias confirmen desde la app</p>
          </div>
        `;
        updateDashboardStats([]);
      }
    }
  } catch (e) {
    // Error de conexión, mostrar datos locales
    const localOrders = JSON.parse(
      localStorage.getItem("bake-sale-orders") || "[]"
    );
    if (localOrders.length > 0) {
      renderDashboardOrders(localOrders);
      renderKitchenSummary(localOrders);
      updateDashboardStats(localOrders);
    }
  }

  // Reintentar pedidos pendientes
  retryPendingOrders();
}

function renderDashboardOrders(orders) {
  const container = document.getElementById("dashboard-orders");
  if (!container) return;

  // Ordenar del más reciente al más antiguo
  const sorted = [...orders].sort(
    (a, b) => new Date(b.timestamp || b.serverTimestamp) - new Date(a.timestamp || a.serverTimestamp)
  );

  container.innerHTML = sorted
    .map(
      (order, index) => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-number">${order.number}</div>
            <div class="order-family">👤 ${order.family}</div>
          </div>
          <span class="status-badge status-${order.status || "pending"}">
            ${getStatusText(order.status || "pending")}
          </span>
        </div>
        <div class="order-items-list">
          ${(order.items || [])
            .map(
              (item) => `
            <div class="order-item-row">
              <span>${item.quantity}x ${item.name}</span>
              <span>${formatPrice(item.total)}</span>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="order-total-row">
          <span>Total</span>
          <span>${formatPrice(order.total || 0)}</span>
        </div>
        <div class="order-time">🕐 ${formatTime(order.timestamp || order.serverTimestamp)}</div>
        <div class="order-actions">
          <button class="btn-mark-ready" onclick="updateOrderStatus('${order.id || order.number}', 'ready')">
            ✅ Listo
          </button>
          <button class="btn-mark-delivered" onclick="updateOrderStatus('${order.id || order.number}', 'delivered')">
            📦 Entregado
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

function renderKitchenSummary(orders) {
  const container = document.getElementById("kitchen-items");
  if (!container) return;

  const activeOrders = orders.filter(
    (o) => o.status !== "delivered"
  );

  const summary = {};
  activeOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const key = item.id || item.name;
      if (!summary[key]) {
        summary[key] = { name: item.name, qty: 0 };
      }
      summary[key].qty += item.quantity || 0;
    });
  });

  const items = Object.values(summary);

  if (items.length === 0) {
    container.innerHTML =
      '<p style="color: var(--text-muted); font-size: 14px;">✅ No hay pedidos activos</p>';
    return;
  }

  items.sort((a, b) => b.qty - a.qty);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  container.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 8px; color: var(--text-light);">
      Total a preparar: <strong>${totalItems} productos</strong>
    </div>
    ${items
      .map(
        (item) => `
      <div class="kitchen-item">
        <span>${item.name}</span>
        <span class="qty">${item.qty} ${item.qty === 1 ? "unidad" : "unidades"}</span>
      </div>
    `
      )
      .join("")}
  `;
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    // Actualizar en el servidor
    await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    showToast("✅ Estado actualizado", "success");
    loadDashboardOrders();
  } catch (e) {
    // Fallback local
    try {
      const orders = JSON.parse(localStorage.getItem("bake-sale-orders") || "[]");
      const index = orders.findIndex((o) => o.number === orderId);
      if (index >= 0) {
        orders[index].status = newStatus;
        localStorage.setItem("bake-sale-orders", JSON.stringify(orders));
        showToast("✅ Estado actualizado (local)", "success");
        loadDashboardOrders();
      }
    } catch (e2) {
      showToast("Error al actualizar", "error");
    }
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
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    return date.toLocaleString("es-BO", {
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
    pendingEl.textContent = orders.filter((o) => (o.status || "pending") === "pending").length;
  if (revenueEl)
    revenueEl.textContent = formatPrice(
      orders.reduce((sum, o) => sum + (o.total || 0), 0)
    );
}

// ─── Exportar pedidos ───
async function exportOrders() {
  try {
    let orders = state.orders;

    // Si no hay pedidos en estado, intentar del servidor
    if (orders.length === 0) {
      const res = await fetch(`${API_BASE}/api/orders`);
      const data = await res.json();
      if (data.success) orders = data.orders;
    }

    if (orders.length === 0) {
      showToast("No hay pedidos para exportar", "error");
      return;
    }

    let text = "🧁 BAKE SALE - RESUMEN DE PEDIDOS\n";
    text += "═══════════════════════════════\n\n";

    // Resumen por producto
    const summary = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.id || item.name;
        if (!summary[key]) {
          summary[key] = { name: item.name, quantity: 0, total: 0 };
        }
        summary[key].quantity += item.quantity || 0;
        summary[key].total += item.total || 0;
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
      text += `\n${order.number} - ${order.family} [${getStatusText(order.status || "pending")}]\n`;
      (order.items || []).forEach((item) => {
        text += `   ${item.quantity}x ${item.name} = ${formatPrice(item.total)}\n`;
      });
      text += `   TOTAL: ${formatPrice(order.total || 0)}\n`;
    });

    // Descargar archivo
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
async function clearAllOrders() {
  if (!confirm("¿Estás seguro? Esto eliminará TODOS los pedidos.")) return;

  try {
    await fetch(`${API_BASE}/api/orders`, { method: "DELETE" });
    state.orders = [];
    loadDashboardOrders();
    showToast("Pedidos eliminados", "info");
  } catch (e) {
    try {
      localStorage.removeItem("bake-sale-orders");
      loadDashboardOrders();
      showToast("Pedidos locales eliminados", "info");
    } catch (e2) {
      showToast("Error", "error");
    }
  }
}
