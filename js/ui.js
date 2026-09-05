import { ZMART_CONFIG } from "./config.js";
import { getCartItemCount, getCart, getCartTotals } from "./cart.js";
import {
  getStoredFavorites,
  saveFavorites,
  getRecentlyViewed,
  saveRecentlyViewed,
  getStoredCustomer,
  getStoredAddresses,
  getNotifications,
} from "./storage.js";
import { formatPrice, getCategoryName } from "./products.js";
import { getCategoryById } from "./data.js";

// ─── Toast ───────────────────────────────────────────────
let toastTimeout = null;

export function showToast(message, options = {}) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  if (toastTimeout) clearTimeout(toastTimeout);

  container.innerHTML = `
    <div class="toast-enter fixed bottom-24 lg:bottom-8 left-4 right-4 lg:left-auto lg:right-8 lg:max-w-sm z-[100] bg-slate-800 text-white rounded-xl px-4 py-3 shadow-xl flex items-center justify-between gap-3 safe-bottom" role="alert">
      <span class="text-sm">${message}</span>
      ${options.action ? `<button type="button" data-toast-action class="text-brandOrange text-sm font-bold whitespace-nowrap">${options.action}</button>` : ""}
    </div>
  `;

  const actionBtn = container.querySelector("[data-toast-action]");
  if (actionBtn && options.onAction) {
    actionBtn.addEventListener("click", () => {
      options.onAction();
      container.innerHTML = "";
    });
  }

  toastTimeout = setTimeout(() => {
    container.innerHTML = "";
  }, options.duration || 3500);
}

// ─── Modal / Bottom Sheet ──────────────────────────────────
let overlayEl = null;

function getOverlay() {
  if (!overlayEl) {
    overlayEl = document.getElementById("modal-root");
  }
  return overlayEl;
}

function closeOverlay() {
  const root = getOverlay();
  if (root) root.innerHTML = "";
}

export function openModal(title, content, options = {}) {
  const root = getOverlay();
  if (!root) return;

  root.innerHTML = `
    <div class="overlay-enter fixed inset-0 z-[90] flex items-end lg:items-center justify-center bg-black/50" data-overlay>
      <div class="sheet-enter lg:modal-enter bg-white w-full lg:max-w-md lg:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto no-scrollbar safe-bottom" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between z-10">
          <h2 class="text-base font-bold text-slate-800">${title}</h2>
          <button type="button" data-close-overlay class="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full" aria-label="Close">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <div class="p-4">${content}</div>
        ${options.footer ? `<div class="sticky bottom-0 bg-white border-t border-slate-100 p-4 safe-bottom">${options.footer}</div>` : ""}
      </div>
    </div>
  `;

  root.querySelector("[data-overlay]").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeOverlay();
  });
  root.querySelector("[data-close-overlay]").addEventListener("click", closeOverlay);
}

export function openBottomSheet(title, content, options = {}) {
  openModal(title, content, options);
}

export function closeModal() {
  closeOverlay();
}

// ─── Confirm dialog ────────────────────────────────────────
export function showConfirm(title, message, onConfirm) {
  openModal(title, `<p class="text-sm text-slate-600">${message}</p>`, {
    footer: `
      <div class="flex gap-3">
        <button type="button" data-cancel class="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 btn-press">Cancel</button>
        <button type="button" data-confirm class="flex-1 py-3 rounded-xl bg-brandOrange text-white text-sm font-bold btn-press">Confirm</button>
      </div>
    `,
  });

  const root = getOverlay();
  root.querySelector("[data-cancel]").addEventListener("click", closeOverlay);
  root.querySelector("[data-confirm]").addEventListener("click", () => {
    closeOverlay();
    onConfirm();
  });
}

// ─── Favorites ─────────────────────────────────────────────
export function isFavorite(productId) {
  return getStoredFavorites().includes(productId);
}

export function toggleFavorite(productId) {
  let favs = getStoredFavorites();
  if (favs.includes(productId)) {
    favs = favs.filter((id) => id !== productId);
  } else {
    favs.push(productId);
  }
  saveFavorites(favs);
  return favs.includes(productId);
}

// ─── Recently Viewed ───────────────────────────────────────
export function addRecentlyViewed(productId) {
  let ids = getRecentlyViewed().filter((id) => id !== productId);
  ids.unshift(productId);
  ids = ids.slice(0, 12);
  saveRecentlyViewed(ids);
}

// ─── Image fallback ──────────────────────────────────────────
export function handleImageError(e) {
  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23f1f5f9' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='14' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";
  e.target.classList.add("img-fallback");
}

// ─── Empty State ─────────────────────────────────────────────
export function renderEmptyState({ icon, title, description, ctaText, ctaRoute, ctaAction, ctaData = {} }) {
  const dataAttrs = Object.entries(ctaData)
    .map(([k, v]) => `data-${k}="${v}"`)
    .join(" ");
  const cta = ctaText
    ? ctaAction
      ? `<button type="button" data-action="${ctaAction}" ${dataAttrs} class="bg-brandOrange text-white text-sm font-bold px-6 py-3 rounded-xl btn-press min-h-[44px]">${ctaText}</button>`
      : `<a href="${ctaRoute}" class="bg-brandOrange text-white text-sm font-bold px-6 py-3 rounded-xl btn-press min-h-[44px] inline-block">${ctaText}</a>`
    : "";
  return `
    <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-3xl mb-4">
        <i class="fa-solid ${icon}"></i>
      </div>
      <h3 class="text-base font-bold text-slate-800 mb-1">${title}</h3>
      <p class="text-sm text-slate-500 mb-6 max-w-xs">${description}</p>
      ${cta}
    </div>
  `;
}

// ─── Skeleton ────────────────────────────────────────────────
export function renderProductSkeleton(count = 4) {
  return Array(count)
    .fill("")
    .map(
      () => `
    <div class="bg-white rounded-2xl border border-slate-100 p-3 space-y-2">
      <div class="skeleton w-full h-28 rounded-xl"></div>
      <div class="skeleton h-3 w-3/4 rounded"></div>
      <div class="skeleton h-3 w-1/2 rounded"></div>
    </div>
  `
    )
    .join("");
}

// ─── Quantity Selector ───────────────────────────────────────
export function renderQuantitySelector(qty, productId, size = "sm") {
  const cls = size === "lg" ? "text-base px-4 py-2" : "text-xs px-2.5 py-1";
  return `
    <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden" role="group" aria-label="Quantity">
      <button type="button" data-action="decrease-qty" data-id="${productId}" class="${cls} min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 font-bold btn-press" aria-label="Decrease quantity">−</button>
      <span class="${cls} font-bold text-slate-800 min-w-[2rem] text-center" aria-live="polite">${qty}</span>
      <button type="button" data-action="increase-qty" data-id="${productId}" class="${cls} min-w-[44px] min-h-[44px] flex items-center justify-center text-brandOrange font-bold btn-press" aria-label="Increase quantity">+</button>
    </div>
  `;
}

// ─── Product Card ────────────────────────────────────────────
export function renderProductCard(product, options = {}) {
  const fav = isFavorite(product.id);
  const lazy = options.lazy !== false ? 'loading="lazy"' : "";
  return `
    <article class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col product-card" data-product-id="${product.id}">
      <div class="relative">
        <a href="#/product/${product.id}" class="block">
          <img src="${product.image}" alt="${product.name}" class="w-full h-32 lg:h-36 object-cover" ${lazy} onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Crect fill=%27%23f1f5f9%27 width=%27200%27 height=%27200%27/%3E%3C/svg%3E'"/>
        </a>
        ${product.discount ? `<span class="absolute top-2 left-2 bg-brandOrange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">${product.discount}% OFF</span>` : ""}
        <button type="button" data-action="toggle-favorite" data-id="${product.id}" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm btn-press" aria-label="${fav ? "Remove from favorites" : "Add to favorites"}">
          <i class="fa-${fav ? "solid" : "regular"} fa-heart ${fav ? "text-red-500" : "text-slate-400"} text-sm"></i>
        </button>
      </div>
      <div class="p-3 flex flex-col flex-1">
        <a href="#/product/${product.id}" class="text-sm font-bold text-slate-800 line-clamp-1 hover:text-brandOrange">${product.name}</a>
        <span class="text-[10px] text-slate-400 mt-0.5">${product.unit}</span>
        <div class="flex items-center gap-1.5 mt-1">
          <span class="text-sm font-bold text-brandOrange">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="text-[10px] text-slate-400 line-through">${formatPrice(product.oldPrice)}</span>` : ""}
        </div>
        <button type="button" data-action="add-to-cart" data-id="${product.id}" class="mt-auto w-full bg-orange-50 text-brandOrange text-xs font-bold py-2.5 rounded-lg border border-orange-100 flex items-center justify-center gap-1 btn-press min-h-[44px]" ${!product.stock ? "disabled" : ""}>
          <i class="fa-solid fa-plus text-[10px]"></i> ${product.stock ? "Add" : "Out of Stock"}
        </button>
      </div>
    </article>
  `;
}

// ─── Category Card ───────────────────────────────────────────
export function renderCategoryCard(category) {
  return `
    <a href="#/category/${category.id}" class="bg-white p-3 lg:p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow space-y-2 btn-press min-h-[90px]" aria-label="${category.name} category">
      <img src="${category.img}" class="w-12 h-12 rounded-full"></img>
      <span class="text-xs font-bold text-slate-700 text-center line-clamp-2">${category.name}</span>
    </a>
  `;
}

// ─── Cart Item ─────────────────────────────────────────────────
export function renderCartItem(item) {
  return `
    <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 cart-item" data-cart-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl shrink-0" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2760%27 height=%2760%27%3E%3Crect fill=%27%23f1f5f9%27 width=%2760%27 height=%2760%27/%3E%3C/svg%3E'"/>
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-bold text-slate-800 line-clamp-1">${item.name}</h4>
        <span class="text-[10px] text-slate-400">${item.unit}</span>
        <span class="text-sm font-bold text-brandOrange block">${formatPrice(item.price)}</span>
      </div>
      <div class="flex flex-col items-end gap-2">
        ${renderQuantitySelector(item.qty, item.id)}
        <button type="button" data-action="remove-cart-item" data-id="${item.id}" class="text-[10px] text-red-500 font-medium btn-press" aria-label="Remove ${item.name}">Remove</button>
      </div>
    </div>
  `;
}

// ─── Order Card ────────────────────────────────────────────────
export function renderOrderCard(order) {
  return `
    <a href="#/order/${order.orderId}" class="block bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start mb-1">
        <span class="text-sm font-bold text-slate-800">${order.orderId}</span>
        <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">${order.status || "Order Placed"}</span>
      </div>
      <div class="text-xs text-slate-400 mb-2">${new Date(order.date).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
      <div class="text-sm font-bold text-brandOrange">${formatPrice(order.total)}</div>
      <div class="text-xs text-slate-500 mt-1">${order.items.length} item${order.items.length !== 1 ? "s" : ""}</div>
    </a>
  `;
}

// ─── Header ────────────────────────────────────────────────────
export function renderHeader(activeRoute) {
  const customer = getStoredCustomer();
  const addresses = getStoredAddresses();
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const locationText = defaultAddr
    ? `${defaultAddr.area || defaultAddr.address}`.slice(0, 30)
    : "Set delivery location";
  const cartCount = getCartItemCount();
  const notifCount = getNotifications().filter((n) => !n.read).length;

  return `
    <header class="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div class="app-container px-4 lg:py-3">
        <!-- Mobile header -->
        <div class="flex lg:hidden items-center justify-between gap-3">
          <a href="#/home" class="flex items-center gap-2 shrink-0" aria-label="ZMart Home">
            <div class="flex items-center justify-center">
            <img src="../assets/images/logo.png" class="w-14 h-14 rounded-full"></img>
            </div>
          </a>
          <button type="button" data-action="open-location" class="flex-1 min-w-0 text-left" aria-label="Delivery location">
            <div class="text-[10px] uppercase font-bold text-slate-400">Deliver To</div>
            <div class="text-xs font-bold text-slate-800 flex items-center gap-1 truncate">
              <i class="fa-solid fa-location-dot text-brandOrange shrink-0"></i>
              <span class="truncate">${locationText}</span>
              <i class="fa-solid fa-chevron-down text-[10px] shrink-0"></i>
            </div>
          </button>
          <div class="flex items-center gap-2 shrink-0">
            <button type="button" data-action="open-notifications" class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 relative btn-press" aria-label="Notifications">
              <i class="fa-regular fa-bell"></i>
              ${notifCount ? `<span class="absolute top-1 right-1 w-4 h-4 bg-brandOrange text-white text-[9px] font-bold rounded-full flex items-center justify-center">${notifCount}</span>` : ""}
            </button>
            <a href="#/cart" class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 relative btn-press" aria-label="Cart">
              <i class="fa-solid fa-cart-shopping"></i>
              <span id="header-cart-badge" class="absolute -top-0.5 -right-0.5 bg-brandOrange text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 ${cartCount ? "" : "hidden"}">${cartCount || 0}</span>
            </a>
          </div>
        </div>

        <!-- Desktop header -->
        <div class="hidden lg:flex items-center gap-6">
          <a href="#/home" class="flex items-center gap-2 shrink-0">
            <div class="w-10 h-10 rounded-xl bg-brandOrange flex items-center justify-center text-white font-bold">Z</div>
            <span class="text-xl font-bold text-slate-800">${ZMART_CONFIG.storeName}</span>
          </a>
          <a href="#/search" class="flex-1 max-w-xl bg-slate-50 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-slate-100 hover:border-brandOrange/30 transition-colors">
            <i class="fa-solid fa-magnifying-glass text-slate-400"></i>
            <span class="text-sm text-slate-400">Search products...</span>
          </a>
          <button type="button" data-action="open-location" class="flex items-center gap-2 text-sm text-slate-600 hover:text-brandOrange btn-press">
            <i class="fa-solid fa-location-dot text-brandOrange"></i>
            <span class="max-w-[150px] truncate">${locationText}</span>
          </button>
          <nav class="flex items-center gap-1">
            <a href="#/categories" class="px-3 py-2 text-sm font-medium ${activeRoute.startsWith("category") || activeRoute === "categories" ? "text-brandOrange" : "text-slate-600 hover:text-brandOrange"}">Categories</a>
            <a href="#/orders" class="px-3 py-2 text-sm font-medium ${activeRoute === "orders" ? "text-brandOrange" : "text-slate-600 hover:text-brandOrange"}">Orders</a>
            <button type="button" data-action="open-cart-drawer" class="px-3 py-2 text-sm font-medium relative ${activeRoute === "cart" ? "text-brandOrange" : "text-slate-600 hover:text-brandOrange"} btn-press">
              Cart
              <span id="desktop-cart-badge" class="ml-1 bg-brandOrange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cartCount ? "" : "hidden"}">${cartCount || 0}</span>
            </button>
            <a href="#/profile" class="px-3 py-2 text-sm font-medium ${activeRoute === "profile" ? "text-brandOrange" : "text-slate-600 hover:text-brandOrange"}">Profile</a>
          </nav>
        </div>
      </div>
    </header>
  `;
}

// ─── Bottom Navigation ─────────────────────────────────────────
export function renderBottomNav(activeTab) {
  const cartCount = getCartItemCount();
  const tabs = [
    { id: "home", icon: "fa-house", label: "Home", route: "#/home" },
    { id: "categories", icon: "fa-border-all", label: "Categories", route: "#/categories" },
    { id: "cart", icon: "fa-cart-shopping", label: "Cart", route: "#/cart", badge: cartCount },
    { id: "orders", icon: "fa-receipt", label: "Orders", route: "#/orders" },
    { id: "profile", icon: "fa-user", label: "Profile", route: "#/profile" },
  ];

  return `
    <nav id="bottom-nav" class="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-40 shadow-lg safe-bottom" aria-label="Main navigation">
      <div class="flex justify-around items-center py-2 px-2">
        ${tabs
          .map(
            (tab) => `
          <a href="${tab.route}" class="nav-btn flex flex-col items-center min-w-[60px] min-h-[44px] justify-center relative ${activeTab === tab.id ? "text-brandOrange" : "text-slate-400"}" aria-label="${tab.label}" ${activeTab === tab.id ? 'aria-current="page"' : ""}>
            <i class="fa-solid ${tab.icon} text-lg"></i>
            ${tab.id === "cart" ? `<span id="nav-cart-badge" class="absolute top-0 right-2 bg-brandOrange text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 ${cartCount ? "" : "hidden"}">${cartCount || 0}</span>` : ""}
            <span class="text-[10px] mt-0.5 font-medium">${tab.label}</span>
          </a>
        `
          )
          .join("")}
      </div>
    </nav>
  `;
}

export function openCartDrawer() {
  const root = document.getElementById("cart-drawer-root");
  if (!root) return;

  const cart = getCart();
  const { total } = getCartTotals();
  const bodyContent = cart.length
    ? `
      <div class="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar mb-4">
        ${cart.map((item) => renderCartItem(item)).join("")}
      </div>
      <div class="border-t border-slate-100 pt-3 space-y-2">
        <div class="flex justify-between text-sm"><span>Total</span><span class="font-bold">${formatPrice(total)}</span></div>
        <a href="#/cart" data-action="close-cart-drawer" class="block w-full bg-brandOrange text-white text-center font-bold py-3 rounded-xl btn-press min-h-[44px] leading-[44px]">View Cart</a>
        <a href="#/checkout" data-action="close-cart-drawer" class="block w-full bg-brandGreen text-white text-center font-bold py-3 rounded-xl btn-press min-h-[44px] leading-[44px]">Checkout</a>
      </div>
    `
    : `<p class="text-sm text-slate-400 text-center py-12">Your cart is empty</p>`;

  root.innerHTML = `
    <div class="overlay-enter fixed inset-0 z-[80] bg-black/50 hidden lg:block" data-overlay data-cart-drawer>
      <aside id="cart-drawer" class="open fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col safe-bottom" role="dialog" aria-label="Cart drawer">
        <div class="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <h2 class="text-lg font-bold text-slate-800">Your Cart</h2>
          <button type="button" data-action="close-cart-drawer" class="w-10 h-10 flex items-center justify-center text-slate-400 rounded-full hover:bg-slate-100 btn-press" aria-label="Close cart">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 no-scrollbar">${bodyContent}</div>
      </aside>
    </div>
  `;

  root.querySelector("[data-overlay]").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeCartDrawer();
  });
}

export function closeCartDrawer() {
  const root = document.getElementById("cart-drawer-root");
  if (root) root.innerHTML = "";
}

export function updateCartBadges() {
  const count = getCartItemCount();
  const navBadge = document.getElementById("nav-cart-badge");
  const headerBadge = document.getElementById("header-cart-badge");
  const desktopBadge = document.getElementById("desktop-cart-badge");

  [navBadge, headerBadge, desktopBadge].forEach((badge) => {
    if (!badge) return;
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove("hidden");
      badge.classList.add("cart-badge-bounce");
      setTimeout(() => badge.classList.remove("cart-badge-bounce"), 400);
    } else {
      badge.classList.add("hidden");
    }
  });
}

export function getCustomerInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function renderSectionHeader(title, linkText, linkRoute) {
  return `
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-base font-bold text-slate-800">${title}</h3>
      ${linkText ? `<a href="${linkRoute}" class="text-xs font-bold text-brandOrange">${linkText}</a>` : ""}
    </div>
  `;
}

export function renderProductGrid(products, options = {}) {
  if (!products.length) return "";
  return `<div class="product-grid">${products.map((p) => renderProductCard(p, options)).join("")}</div>`;
}

export function renderStatusTimeline(currentStep) {
  const steps = ["Order Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];
  return `
    <div class="space-y-3" aria-label="Order status">
      ${steps
        .map((step, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;
          return `
          <div class="flex items-center gap-3 text-sm ${done ? "font-bold text-brandGreen" : "text-slate-300"}">
            <i class="fa-solid ${done ? (active && i < 4 ? "fa-spinner animate-spin text-brandOrange" : "fa-circle-check") : "fa-circle"} w-5 text-center"></i>
            <span>${step}</span>
          </div>
        `;
        })
        .join("")}
      <p class="text-[10px] text-slate-400 mt-2">Status shown for reference only. Updates are not synced with a server.</p>
    </div>
  `;
}

export function renderStaticPage(title, content) {
  return `
    <div class="page-enter app-container px-4 py-6 max-w-2xl">
      <div class="flex items-center gap-3 mb-6">
        <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 class="text-lg font-bold text-slate-800">${title}</h1>
      </div>
      <div class="bg-white rounded-2xl border border-slate-100 p-6 prose prose-sm text-slate-600 max-w-none">
        ${content}
      </div>
    </div>
  `;
}
