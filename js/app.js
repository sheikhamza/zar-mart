import { registerRoute, initRouter, navigate, goBack, getActiveTab, getCurrentRoute, refreshRoute } from "./router.js";
import {
  renderHeader,
  renderBottomNav,
  showToast,
  openModal,
  closeModal,
  showConfirm,
  toggleFavorite,
  addRecentlyViewed,
  updateCartBadges,
  openCartDrawer,
  closeCartDrawer,
  renderProductSkeleton,
} from "./ui.js";
import {
  renderHomeView,
  renderCategoriesView,
  renderCategoryView,
  renderProductView,
  renderSearchView,
  renderSearchResults,
  renderCartView,
  renderCheckoutView,
  renderOrderReadyView,
  renderOrdersView,
  renderOrderDetailView,
  renderProfileView,
  renderFavoritesView,
  renderRecentlyViewedView,
  renderAddressesView,
  renderNotificationsView,
  renderHelpView,
  renderAboutView,
  renderPrivacyView,
  renderTermsView,
  renderProductsListView,
  categoryState,
  getSortFilterModalContent,
  renderAddressForm,
  renderAddressSelectModal,
} from "./views.js";
import { addToCart, updateCartQty, removeFromCart, clearCart, getCart, getCartTotals, isCartEmpty } from "./cart.js";
import { performSearch, addRecentSearch, clearRecentSearches } from "./search.js";
import { generateOrderId, createOrder, getOrderById, advanceOrderStatus } from "./orders.js";
import { buildWhatsAppMessage, openWhatsApp, validatePhone, normalizePhone, formatPhoneDisplay } from "./whatsapp.js";
import {
  saveCustomer,
  getStoredAddresses,
  saveAddresses,
  saveNotifications,
  getNotifications,
  isStorageAvailable,
} from "./storage.js";
import { getProductById } from "./products.js";

const appMain = () => document.getElementById("app-main");
const appHeader = () => document.getElementById("app-header");
const appNav = () => document.getElementById("app-nav");

let pendingOrder = null;
let detailQty = 1;

// PWA install prompt
let deferredInstallPrompt = null;

function setupPWAInstall() {
  window.addEventListener("beforeinstallprompt", (event) => {
    // Browser ka default mini-infobar prevent karo
    event.preventDefault();

    // Prompt ko save karo
    deferredInstallPrompt = event;

    console.log("PWA install available");

    // Agar button currently DOM mein hai to show karo
    updateInstallButton();
  });

  window.addEventListener("appinstalled", () => {
    console.log("ZMart installed successfully");

    deferredInstallPrompt = null;

    updateInstallButton();
  });

  updateInstallButton();
}

function updateInstallButton() {
  const buttons = document.querySelectorAll('[data-action="install-app"]');

  buttons.forEach((button) => {
    // Agar already standalone app hai
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone || !deferredInstallPrompt) {
      button.classList.add("hidden");
    } else {
      button.classList.remove("hidden");
    }
  });
}

async function installPWA() {
  if (!deferredInstallPrompt) {
    showToast("Install option is not available right now.");
    return;
  }

  // Native browser install popup
  deferredInstallPrompt.prompt();

  const { outcome } = await deferredInstallPrompt.userChoice;

  console.log("PWA install result:", outcome);

  // Prompt sirf ek baar use hota hai
  deferredInstallPrompt = null;

  updateInstallButton();
}

function renderShell(route) {
  appHeader().innerHTML = renderHeader(route);
  appNav().innerHTML = renderBottomNav(getActiveTab(route));
}

/** Refresh header/nav immediately (cart count, delivery location, etc.) */
function refreshShell() {
  renderShell(getCurrentRoute());
}

function onCartChanged() {
  refreshShell();
  updateCartBadges();
}

function setMainContent(html) {
  appMain().innerHTML = html;
}

// ─── Route handlers ──────────────────────────────────────────
registerRoute("/home", () => {
  setMainContent(`<div class="app-container px-4 py-4 page-enter"><div class="product-grid">${renderProductSkeleton(4)}</div></div>`);
  setTimeout(() => setMainContent(renderHomeView()), 250);
});

registerRoute("/categories", () => {
  setMainContent(renderCategoriesView());
});

registerRoute("/products/:type", (params) => {
  setMainContent(renderProductsListView(params.type));
});

registerRoute("/category/:slug", (params) => {
  setMainContent(renderCategoryView(params.slug));
});

registerRoute("/product/:id", (params) => {
  detailQty = 1;
  addRecentlyViewed(Number(params.id));
  setMainContent(renderProductView(params.id));
});

registerRoute("/search", () => {
  setMainContent(renderSearchView());
});

registerRoute("/cart", () => {
  setMainContent(renderCartView());
});

registerRoute("/checkout", () => {
  if (isCartEmpty()) {
    navigate("/cart");
    return;
  }
  setMainContent(renderCheckoutView());
});

registerRoute("/order-ready/:id", (params) => {
  const blocked = pendingOrder?.blocked || false;
  setMainContent(renderOrderReadyView(params.id, blocked));
  pendingOrder = null;
});

registerRoute("/orders", () => {
  setMainContent(renderOrdersView());
});

registerRoute("/order/:id", (params) => {
  setMainContent(renderOrderDetailView(params.id));
});

registerRoute("/profile", () => {
  setMainContent(renderProfileView());
});

registerRoute("/favorites", () => {
  setMainContent(renderFavoritesView());
});

registerRoute("/recently-viewed", () => {
  setMainContent(renderRecentlyViewedView());
});

registerRoute("/addresses", () => {
  setMainContent(renderAddressesView());
});

registerRoute("/notifications", () => {
  const notifs = getNotifications().map((n) => ({ ...n, read: true }));
  saveNotifications(notifs);
  setMainContent(renderNotificationsView());
});

registerRoute("/help", () => {
  setMainContent(renderHelpView());
});

registerRoute("/about", () => {
  setMainContent(renderAboutView());
});

registerRoute("/privacy", () => {
  setMainContent(renderPrivacyView());
});

registerRoute("/terms", () => {
  setMainContent(renderTermsView());
});

// ─── Event delegation ────────────────────────────────────────
function handleAppClick(e) {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id ? Number(target.dataset.id) : null;

  switch (action) {
    case "install-app":
      e.preventDefault();
      installPWA();
      break;
    case "go-back":
      e.preventDefault();
      goBack();
      break;

    case "add-to-cart": {
      e.preventDefault();
      e.stopPropagation();
      const result = addToCart(id);
      if (result) {
        onCartChanged();
        showToast(`${result.product.name} added to cart`, {
          action: "View Cart",
          onAction: () => navigate("/cart"),
        });
      }
      break;
    }

    case "add-to-cart-detail": {
      e.preventDefault();
      const qtyEl = document.querySelector("[data-detail-qty] span[aria-live]");
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
      const result = addToCart(id, qty);
      if (result) {
        onCartChanged();
        showToast(`${result.product.name} added to cart`, {
          action: "View Cart",
          onAction: () => navigate("/cart"),
        });
      }
      break;
    }

    case "buy-now": {
      e.preventDefault();
      const qtyEl = document.querySelector("[data-detail-qty] span[aria-live]");
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
      addToCart(id, qty);
      onCartChanged();
      navigate("/checkout");
      break;
    }

    case "toggle-favorite": {
      e.preventDefault();
      e.stopPropagation();
      const isFav = toggleFavorite(id);
      const icon = target.querySelector("i") || target;
      if (icon.classList) {
        icon.className = `fa-${isFav ? "solid" : "regular"} fa-heart text-lg ${isFav ? "text-red-500 heart-pop" : "text-slate-400"}`;
      }
      showToast(isFav ? "Added to favorites" : "Removed from favorites");
      break;
    }

    case "increase-qty":
    case "decrease-qty": {
      e.preventDefault();
      const delta = action === "increase-qty" ? 1 : -1;

      // Detail page qty
      const detailContainer = target.closest("[data-detail-qty]");
      if (detailContainer) {
        const span = detailContainer.querySelector("[aria-live]");
        let q = parseInt(span.textContent, 10) + delta;
        if (q < 1) q = 1;
        span.textContent = q;
        break;
      }

      // Cart qty
      if (delta < 0 && getCart().find((i) => i.id === id)?.qty === 1) {
        showConfirm("Remove Item", "Remove this item from your cart?", () => {
          removeFromCart(id);
          onCartChanged();
          navigate("/cart", true);
        });
      } else {
        updateCartQty(id, delta);
        onCartChanged();
        navigate("/cart", true);
      }
      break;
    }

    case "remove-cart-item":
      e.preventDefault();
      showConfirm("Remove Item", "Remove this item from your cart?", () => {
        removeFromCart(id);
        onCartChanged();
        navigate("/cart", true);
      });
      break;

    case "clear-cart":
      e.preventDefault();
      showConfirm("Clear Cart", "Remove all items from your cart?", () => {
        clearCart();
        onCartChanged();
        navigate("/cart", true);
      });
      break;

    case "clear-recent-searches":
      e.preventDefault();
      clearRecentSearches();
      navigate("/search");
      break;

    case "search-term":
      e.preventDefault();
      runSearch(target.dataset.term);
      break;

    case "clear-search":
      e.preventDefault();
      navigate("/search");
      break;

    case "apply-sort":
    case "apply-filter": {
      e.preventDefault();
      const categoryId = target.dataset.category;
      if (!categoryState[categoryId]) {
        categoryState[categoryId] = { sort: "popular", filters: [] };
      }
      if (action === "apply-sort") {
        const selected = document.querySelector('input[name="sort"]:checked');
        if (selected) categoryState[categoryId].sort = selected.value;
      } else {
        const checked = [...document.querySelectorAll('input[name="filter"]:checked')];
        categoryState[categoryId].filters = checked.map((c) => c.value);
      }
      closeModal();
      navigate(`/category/${categoryId}`, true);
      break;
    }

    case "advance-order-status":
      e.preventDefault();
      {
        const updated = advanceOrderStatus(target.dataset.orderId);
        if (updated) {
          showToast(`Status updated: ${updated.status}`);
          navigate(`/order/${target.dataset.orderId}`, true);
        }
      }
      break;

    case "open-sort":
      e.preventDefault();
      openSortFilter(target.dataset.category, "sort");
      break;

    case "open-filter":
      e.preventDefault();
      openSortFilter(target.dataset.category, "filter");
      break;

    case "clear-filters":
      e.preventDefault();
      if (target.dataset.category) {
        categoryState[target.dataset.category] = { sort: "popular", filters: [] };
        navigate(`/category/${target.dataset.category}`, true);
      }
      break;

    case "open-cart-drawer":
      e.preventDefault();
      openCartDrawer();
      break;

    case "close-cart-drawer":
      e.preventDefault();
      closeCartDrawer();
      break;

    case "open-location":
      e.preventDefault();
      navigate("/addresses");
      break;

    case "open-notifications":
      e.preventDefault();
      navigate("/notifications");
      break;

    case "add-address":
      e.preventDefault();
      openAddressForm();
      break;

    case "edit-address":
      e.preventDefault();
      openAddressForm(id);
      break;

    case "delete-address":
      e.preventDefault();
      showConfirm("Delete Address", "Are you sure you want to delete this address?", () => {
        let addresses = getStoredAddresses().filter((a) => a.id !== id);
        saveAddresses(addresses);
        refreshShell();
        navigate("/addresses", true);
      });
      break;

    case "set-default-address":
      e.preventDefault();
      {
        let addresses = getStoredAddresses().map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));
        saveAddresses(addresses);
        refreshShell();
        navigate("/addresses", true);
      }
      break;

    case "select-address":
      e.preventDefault();
      {
        const addresses = getStoredAddresses();
        openModal("Select Address", renderAddressSelectModal(addresses));
      }
      break;

    case "use-address":
      e.preventDefault();
      {
        const addr = getStoredAddresses().find((a) => String(a.id) === String(target.dataset.id));
        if (addr) {
          const addrField = document.getElementById("cust-address");
          const areaField = document.getElementById("cust-area");
          if (addrField) addrField.value = addr.address;
          if (areaField) areaField.value = addr.area;
        }
        closeModal();
      }
      break;

    case "retry-whatsapp":
      e.preventDefault();
      {
        const order = getOrderById(target.dataset.orderId);
        if (order) {
          const msg = buildWhatsAppMessage(order);
          openWhatsApp(msg);
        }
      }
      break;
  }
}

function openSortFilter(categoryId, type) {
  const title = type === "sort" ? "Sort By" : "Filter";
  const applyAction = type === "sort" ? "apply-sort" : "apply-filter";
  openModal(title, getSortFilterModalContent(categoryId, type), {
    footer: `
      <button type="button" data-action="${applyAction}" data-category="${categoryId}" class="w-full bg-brandOrange text-white font-bold py-3 rounded-xl btn-press min-h-[44px]">Apply</button>
    `,
  });
}

function openAddressForm(editId = null) {
  const addresses = getStoredAddresses();
  const address = editId != null ? addresses.find((a) => String(a.id) === String(editId)) : null;

  openModal(editId ? "Edit Address" : "Add Address", renderAddressForm(address), {
    footer: `
      <button type="button" id="save-address-btn" class="w-full bg-brandOrange text-white font-bold py-3 rounded-xl btn-press">Save Address</button>
    `,
  });

  document.getElementById("save-address-btn").addEventListener("click", () => {
    const form = document.getElementById("address-form");
    const fd = new FormData(form);
    const label = fd.get("label")?.trim();
    const addr = fd.get("address")?.trim();
    const area = fd.get("area")?.trim();
    const isDefault = fd.get("isDefault") === "on";

    if (!label || !addr || !area) {
      showToast("Please fill all address fields");
      return;
    }

    let addresses = getStoredAddresses();
    if (editId != null) {
      addresses = addresses.map((a) =>
        String(a.id) === String(editId) ? { ...a, label, address: addr, area, isDefault } : isDefault ? { ...a, isDefault: false } : a
      );
    } else {
      const newAddr = {
        id: Date.now(),
        label,
        address: addr,
        area,
        isDefault: isDefault || addresses.length === 0,
      };
      if (isDefault) addresses = addresses.map((a) => ({ ...a, isDefault: false }));
      addresses.push(newAddr);
    }

    if (isDefault && editId != null) {
      addresses = addresses.map((a) => ({ ...a, isDefault: String(a.id) === String(editId) }));
    }

    saveAddresses(addresses);
    closeModal();
    refreshShell();
    navigate("/addresses", true);
    showToast("Address saved");
  });
}

function runSearch(query) {
  const input = document.getElementById("search-input");
  if (input) input.value = query;

  addRecentSearch(query);
  const results = performSearch(query);
  const area = document.getElementById("search-results-area");
  if (area) {
    area.innerHTML = renderSearchResults(query, results);
  }
}

function handleSearchInput(e) {
  if (e.target.id !== "search-input") return;
  const query = e.target.value;
  const results = performSearch(query);
  const area = document.getElementById("search-results-area");
  if (area) {
    area.innerHTML = renderSearchResults(query, results);
  }
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  if (isCartEmpty()) {
    showToast("Your cart is empty");
    navigate("/cart");
    return;
  }

  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const address = form.address.value.trim();
  const area = form.area.value.trim();
  const notes = form.notes.value.trim();
  const payment = form.payment.value;

  if (!name || !phone || !address || !area) {
    showToast("Please fill all required fields");
    return;
  }

  if (!validatePhone(phone)) {
    showToast("Enter a valid Pakistani phone number (e.g. 03001234567)");
    return;
  }

  const normalizedPhone = normalizePhone(phone);
  const cart = getCart();
  const { subtotal, delivery, total } = getCartTotals();
  const orderId = generateOrderId();

  const order = {
    orderId,
    customer: {
      name,
      phone: formatPhoneDisplay(normalizedPhone),
      address,
      area,
      notes,
    },
    items: cart.map((item) => ({ ...item })),
    subtotal,
    delivery,
    total,
    payment,
    statusStep: 0,
  };

  const message = buildWhatsAppMessage(order);
  const whatsappOpened = openWhatsApp(message);

  createOrder(order);

  saveCustomer({ name, phone: formatPhoneDisplay(normalizedPhone) });

  addLocalNotification("Order Prepared", `Your order ${orderId} is ready to send via WhatsApp.`);

  clearCart();
  onCartChanged();

  pendingOrder = { orderId, blocked: !whatsappOpened };
  navigate(`/order-ready/${orderId}`);
}

function addLocalNotification(title, message) {
  const notifs = getNotifications();
  notifs.unshift({ id: Date.now(), title, message, date: new Date().toISOString(), read: false });
  saveNotifications(notifs.slice(0, 20));
}

// ─── Offline handling ────────────────────────────────────────
function setupOfflineIndicator() {
  const banner = document.getElementById("offline-banner");

  function updateOnlineStatus(isInitial = false) {
    if (navigator.onLine) {
      if (banner.dataset.wasOffline === "true") {
        showToast("Back online");
        banner.dataset.wasOffline = "false";
      }
      banner.classList.add("hidden-banner");
      banner.setAttribute("aria-hidden", "true");
    } else {
      banner.classList.remove("hidden-banner");
      banner.setAttribute("aria-hidden", "false");
      if (!isInitial) {
        banner.dataset.wasOffline = "true";
        showToast("You're offline");
        addLocalNotification("Offline Mode", "You are currently offline. Some features may be limited.");
      }
    }
  }

  window.addEventListener("online", () => updateOnlineStatus());
  window.addEventListener("offline", () => updateOnlineStatus());
  updateOnlineStatus(true);
}

// ─── Service Worker ──────────────────────────────────────────
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .catch((err) => console.warn("SW registration failed:", err));
    });
  }
}

// ─── Init ────────────────────────────────────────────────────
function init() {
  if (!isStorageAvailable()) {
    showToast("LocalStorage unavailable. Some features may not work.");
  }

  initRouter((route) => {
    renderShell(route);
    updateCartBadges();

    // Route change ke baad install button check
    updateInstallButton();
  });

  document.addEventListener("click", handleAppClick);

  document.getElementById("app").addEventListener("input", handleSearchInput);

  document.getElementById("app").addEventListener("submit", (e) => {
    if (e.target.id === "checkout-form") {
      handleCheckoutSubmit(e);
    }
  });

  setupOfflineIndicator();

  // PWA install setup
  setupPWAInstall();

  registerServiceWorker();
}

init();
