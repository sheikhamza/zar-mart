import { categories } from "./data.js";
import {
  getFeaturedProducts,
  getPopularProducts,
  getDealsProducts,
  getProductById,
  getProductsByCategory,
  getProductsByIds,
  getCategoryName,
  formatPrice,
  sortProducts,
  filterProducts,
  getRelatedProducts,
} from "./products.js";
import {
  getCart,
  getCartTotals,
  isCartEmpty,
} from "./cart.js";
import { getOrders, getOrderById, formatOrderDate } from "./orders.js";
import { getRecentSearchList } from "./search.js";
import {
  getStoredCustomer,
  getStoredAddresses,
  getRecentlyViewed,
  getNotifications,
  getStoredFavorites,
} from "./storage.js";
import { ZMART_CONFIG } from "./config.js";
import { SORT_OPTIONS, FILTER_OPTIONS } from "./config.js";
import {
  renderProductCard,
  renderCategoryCard,
  renderCartItem,
  renderOrderCard,
  renderEmptyState,
  renderProductSkeleton,
  renderQuantitySelector,
  renderSectionHeader,
  renderProductGrid,
  renderStatusTimeline,
  renderStaticPage,
  isFavorite,
  getCustomerInitials,
} from "./ui.js";

// Shared state for category filters
export const categoryState = {};

export function renderHomeView() {
  const featured = getDealsProducts().slice(0, 8);
  const popular = getPopularProducts().slice(0, 8);
  const recentIds = getRecentlyViewed().slice(0, 6);
  const recentProducts = getProductsByIds(recentIds);

  return `
    <div class="page-enter">
      <div class="app-container px-4 py-4 space-y-6">
        <a href="#/search" class="block bg-white rounded-xl p-3 flex items-center gap-3 border border-slate-100 shadow-sm hover:border-brandOrange/30 transition-colors lg:hidden" aria-label="Search products">
          <i class="fa-solid fa-magnifying-glass text-slate-400"></i>
          <span class="text-sm text-slate-400">Search products...</span>
        </a>

        <section class="bg-gradient-to-r from-amber-500 to-brandOrange rounded-2xl p-5 lg:p-8 text-white relative overflow-hidden shadow-md">
          <div class="relative z-10 max-w-lg">
            <span class="bg-white/20 text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">Fast Delivery</span>
            <h2 class="text-xl lg:text-2xl font-bold leading-tight mt-2">Fresh groceries delivered fast</h2>
            <p class="text-sm text-white/80 mt-1">Quality products at your doorstep</p>
            <a href="#/categories" class="inline-block bg-white text-brandOrange text-sm font-bold px-5 py-2.5 rounded-xl shadow mt-4 btn-press">Shop Now</a>
          </div>
          <button type="button" data-action="install-app" class="hidden w-full bg-brandOrange text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 btn-press">
            <i class="fa-solid fa-download"></i>
            Install ZMart App
          </button>
          <i class="fa-solid fa-basket-shopping text-8xl lg:text-9xl text-white/15 absolute -right-4 -bottom-4"></i>
        </section>

        <section>
          ${renderSectionHeader("Categories", "See All", "#/categories")}
          <div class="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            ${categories.map((c) => `
              <a href="#/category/${c.id}" class="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center min-w-[72px] shrink-0 shadow-sm hover:shadow-md transition-shadow btn-press">
                <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-brandOrange mb-1.5">
                  <i class="fa-solid ${c.icon}"></i>
                </div>
                <span class="text-[10px] font-semibold text-slate-700 text-center line-clamp-2">${c.name}</span>
              </a>
            `).join("")}
          </div>
        </section>

        <section>
          ${renderSectionHeader("Today's Deals", "See All", "#/products/deals")}
          ${renderProductGrid(featured)}
        </section>

        <section>
          ${renderSectionHeader("Popular Products", "See All", "#/products/popular")}
          ${renderProductGrid(popular)}
        </section>

        ${recentProducts.length ? `
        <section>
          ${renderSectionHeader("Recently Viewed", "", "")}
          ${renderProductGrid(recentProducts)}
        </section>
        ` : ""}
      </div>
    </div>
  `;
}

export function renderCategoriesView() {
  return `
    <div class="page-enter app-container px-4 py-4">
      <h1 class="text-lg font-bold text-slate-800 mb-4">Categories</h1>
      <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        ${categories.map((c) => renderCategoryCard(c)).join("")}
      </div>
    </div>
  `;
}

export function renderProductsListView(type) {
  const configs = {
    deals: { title: "Today's Deals", products: getDealsProducts() },
    popular: { title: "Popular Products", products: getPopularProducts() },
  };
  const config = configs[type];
  if (!config) return renderNotFound();

  return `
    <div class="page-enter app-container px-4 py-4">
      <div class="flex items-center gap-3 mb-4">
        <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-slate-800">${config.title}</h1>
          <p class="text-xs text-slate-400">${config.products.length} products</p>
        </div>
      </div>
      ${config.products.length ? renderProductGrid(config.products) : renderEmptyState({
        icon: "fa-box-open",
        title: "No products found",
        description: "Check back later for new deals.",
        ctaText: "Go Home",
        ctaRoute: "#/home",
      })}
    </div>
  `;
}

export function renderCategoryView(categoryId) {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return renderNotFound();

  if (!categoryState[categoryId]) {
    categoryState[categoryId] = { sort: "popular", filters: [] };
  }
  const state = categoryState[categoryId];
  let products = getProductsByCategory(categoryId);
  products = filterProducts(products, state.filters);
  products = sortProducts(products, state.sort);

  return `
    <div class="page-enter app-container px-4 py-4">
      <div class="flex items-center gap-3 mb-4">
        <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div class="flex-1">
          <h1 class="text-lg font-bold text-slate-800">${cat.name}</h1>
          <p class="text-xs text-slate-400">${products.length} product${products.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div class="flex gap-2 mb-4">
        <button type="button" data-action="open-sort" data-category="${categoryId}" class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 btn-press min-h-[44px]">
          <i class="fa-solid fa-arrow-down-wide-short text-brandOrange"></i> Sort
        </button>
        <button type="button" data-action="open-filter" data-category="${categoryId}" class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 btn-press min-h-[44px]">
          <i class="fa-solid fa-filter text-brandOrange"></i> Filter
          ${state.filters.length ? `<span class="bg-brandOrange text-white text-[10px] px-1.5 rounded-full">${state.filters.length}</span>` : ""}
        </button>
      </div>

      ${products.length ? renderProductGrid(products) : renderEmptyState({
        icon: "fa-box-open",
        title: "No products found",
        description: "Try adjusting your filters.",
        ctaText: "Clear Filters",
        ctaAction: "clear-filters",
        ctaData: { category: categoryId },
      })}
    </div>
  `;
}

export function renderProductView(productId) {
  const product = getProductById(productId);
  if (!product) return renderNotFound();

  const fav = isFavorite(product.id);
  const related = getRelatedProducts(product);

  return `
    <div class="page-enter app-container px-4 py-4 pb-8">
      <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 mb-3 btn-press" aria-label="Go back">
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm mb-4">
        <div class="relative">
          <img src="${product.image}" alt="${product.name}" class="w-full h-56 lg:h-72 object-cover" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect fill=%27%23f1f5f9%27 width=%27400%27 height=%27300%27/%3E%3C/svg%3E'"/>
          <button type="button" data-action="toggle-favorite" data-id="${product.id}" class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow btn-press" aria-label="${fav ? "Remove from favorites" : "Add to favorites"}">
            <i class="fa-${fav ? "solid" : "regular"} fa-heart ${fav ? "text-red-500 heart-pop" : "text-slate-400"} text-lg"></i>
          </button>
        </div>
        <div class="p-4 lg:p-6">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs text-brandOrange font-medium">${getCategoryName(product.category)}</span>
              <h1 class="text-xl font-bold text-slate-800 mt-0.5">${product.name}</h1>
              <span class="text-sm text-slate-400">${product.unit}</span>
            </div>
            ${product.discount ? `<span class="bg-orange-100 text-brandOrange text-xs font-bold px-2.5 py-1 rounded-full shrink-0">${product.discount}% OFF</span>` : ""}
          </div>
          <div class="flex items-center gap-2 mt-3">
            <span class="text-2xl font-bold text-brandOrange">${formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="text-sm text-slate-400 line-through">${formatPrice(product.oldPrice)}</span>` : ""}
          </div>
          <p class="text-sm mt-2 ${product.stock ? "text-brandGreen" : "text-red-500"} font-medium">
            ${product.stock ? "✓ In Stock" : "✗ Out of Stock"}
          </p>
          <p class="text-sm text-slate-500 mt-3 leading-relaxed">${product.description}</p>

          <div class="flex items-center gap-4 mt-6">
            <div data-detail-qty>
              ${renderQuantitySelector(1, product.id, "lg")}
            </div>
          </div>

          <div class="flex gap-3 mt-4">
            <button type="button" data-action="add-to-cart-detail" data-id="${product.id}" class="flex-1 bg-orange-50 text-brandOrange font-bold py-3.5 rounded-xl border border-orange-100 btn-press min-h-[44px]" ${!product.stock ? "disabled" : ""}>
              Add to Cart
            </button>
            <button type="button" data-action="buy-now" data-id="${product.id}" class="flex-1 bg-brandOrange text-white font-bold py-3.5 rounded-xl shadow-md btn-press min-h-[44px]" ${!product.stock ? "disabled" : ""}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      ${related.length ? `
        <section>
          ${renderSectionHeader("Related Products", "", "")}
          ${renderProductGrid(related)}
        </section>
      ` : ""}
    </div>
  `;
}

export function renderSearchView(query = "") {
  const recent = getRecentSearchList();
  const popular = ZMART_CONFIG.popularSearches;

  return `
    <div class="page-enter app-container px-4 py-4">
      <div class="flex items-center gap-3 mb-4">
        <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press shrink-0" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div class="flex-1 bg-white rounded-xl p-2.5 flex items-center gap-2 border border-slate-100 shadow-sm">
          <i class="fa-solid fa-magnifying-glass text-slate-400"></i>
          <input type="search" id="search-input" value="${query}" placeholder="Search products..." class="w-full text-sm outline-none bg-transparent" autofocus aria-label="Search products"/>
          ${query ? `<button type="button" data-action="clear-search" class="text-slate-400 btn-press" aria-label="Clear search"><i class="fa-solid fa-xmark"></i></button>` : ""}
        </div>
      </div>

      <div id="search-results-area">
        ${query ? "" : renderSearchSuggestions(recent, popular)}
      </div>
    </div>
  `;
}

function renderSearchSuggestions(recent, popular) {
  return `
    ${recent.length ? `
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-sm font-bold text-slate-800">Recent Searches</h3>
          <button type="button" data-action="clear-recent-searches" class="text-xs text-brandOrange font-medium btn-press">Clear</button>
        </div>
        <div class="flex flex-wrap gap-2">
          ${recent.map((s) => `<button type="button" data-action="search-term" data-term="${s}" class="bg-white px-3 py-1.5 rounded-lg text-xs border border-slate-100 text-slate-600 btn-press">${s}</button>`).join("")}
        </div>
      </div>
    ` : ""}
    <div>
      <h3 class="text-sm font-bold text-slate-800 mb-2">Popular Searches</h3>
      <div class="flex flex-wrap gap-2">
        ${popular.map((s) => `<button type="button" data-action="search-term" data-term="${s}" class="bg-white px-3 py-1.5 rounded-lg text-xs border border-slate-100 text-slate-600 btn-press">${s}</button>`).join("")}
      </div>
    </div>
  `;
}

export function renderSearchResults(query, results) {
  if (!query.trim()) return renderSearchSuggestions(getRecentSearchList(), ZMART_CONFIG.popularSearches);

  if (!results.length) {
    return `
      ${renderEmptyState({
        icon: "fa-magnifying-glass",
        title: "No products found",
        description: "Try searching for milk, bread, eggs...",
        ctaText: "Browse Categories",
        ctaRoute: "#/categories",
      })}
    `;
  }

  return `
    <p class="text-sm text-slate-500 mb-4">${results.length} product${results.length !== 1 ? "s" : ""} found</p>
    ${renderProductGrid(results)}
  `;
}

export function renderCartView() {
  const cart = getCart();
  const { subtotal, delivery, total, itemDiscount } = getCartTotals();

  if (!cart.length) {
    return `
      <div class="page-enter">
        ${renderEmptyState({
          icon: "fa-cart-shopping",
          title: "Your cart is empty",
          description: "Add some groceries to get started!",
          ctaText: "Start Shopping",
          ctaRoute: "#/home",
        })}
      </div>
    `;
  }

  return `
    <div class="page-enter app-container px-4 py-4">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-lg font-bold text-slate-800">My Cart</h1>
        <button type="button" data-action="clear-cart" class="text-xs text-red-500 font-medium btn-press">Clear Cart</button>
      </div>

      <div class="space-y-3 mb-4" id="cart-items">
        ${cart.map((item) => renderCartItem(item)).join("")}
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-100 space-y-2 shadow-sm sticky bottom-20 lg:bottom-4">
        <div class="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        ${itemDiscount ? `<div class="flex justify-between text-sm text-brandGreen"><span>Discount</span><span>- ${formatPrice(itemDiscount)}</span></div>` : ""}
        <div class="flex justify-between text-sm text-slate-500"><span>Delivery Fee</span><span>${formatPrice(delivery)}</span></div>
        <hr class="border-slate-100"/>
        <div class="flex justify-between text-base font-bold text-slate-800"><span>Grand Total</span><span>${formatPrice(total)}</span></div>
        <a href="#/checkout" class="block w-full bg-brandOrange text-white font-bold text-sm py-3.5 rounded-xl mt-2 text-center shadow btn-press min-h-[44px] leading-[44px]">Proceed to Checkout</a>
      </div>
    </div>
  `;
}

export function renderCheckoutView() {
  if (isCartEmpty()) {
    return renderCartView();
  }

  const cart = getCart();
  const { subtotal, delivery, total } = getCartTotals();
  const addresses = getStoredAddresses();
  const defaultAddr = addresses.find((a) => a.isDefault);

  return `
    <div class="page-enter app-container px-4 py-4 max-w-2xl">
      <div class="flex items-center gap-3 mb-4">
        <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 class="text-lg font-bold text-slate-800">Checkout</h1>
      </div>

      <form id="checkout-form" class="space-y-4" novalidate>
        ${addresses.length ? `
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-sm font-bold text-slate-800">Saved Addresses</h2>
              <button type="button" data-action="select-address" class="text-xs text-brandOrange font-medium btn-press">Change</button>
            </div>
            ${defaultAddr ? `
              <p class="text-sm text-slate-600">${defaultAddr.label || "Home"}</p>
              <p class="text-xs text-slate-400">${defaultAddr.address}, ${defaultAddr.area}</p>
            ` : `<p class="text-xs text-slate-400">No default address selected</p>`}
          </div>
        ` : ""}

        <div class="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-sm">
          <h2 class="text-sm font-bold text-slate-800">Delivery Details</h2>
          <div>
            <label for="cust-name" class="text-xs font-medium text-slate-600 block mb-1">Full Name</label>
            <input type="text" id="cust-name" name="name" required placeholder="Enter your full name" class="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brandOrange" />
          </div>
          <div>
            <label for="cust-phone" class="text-xs font-medium text-slate-600 block mb-1">Phone Number</label>
            <input type="tel" id="cust-phone" name="phone" required placeholder="03001234567" class="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brandOrange" />
          </div>
          <div>
            <label for="cust-address" class="text-xs font-medium text-slate-600 block mb-1">Complete Address</label>
            <input type="text" id="cust-address" name="address" required placeholder="House #, Street, Block" value="${defaultAddr?.address || ""}" class="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brandOrange" />
          </div>
          <div>
            <label for="cust-area" class="text-xs font-medium text-slate-600 block mb-1">Area</label>
            <input type="text" id="cust-area" name="area" required placeholder="Area, City" value="${defaultAddr?.area || ""}" class="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brandOrange" />
          </div>
          <div>
            <label for="cust-notes" class="text-xs font-medium text-slate-600 block mb-1">Delivery Notes (optional)</label>
            <textarea id="cust-notes" name="notes" rows="2" placeholder="Landmark, gate code, etc." class="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brandOrange resize-none"></textarea>
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <h2 class="text-sm font-bold text-slate-800 mb-2">Payment Method</h2>
          <label class="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer min-h-[44px]">
            <input type="radio" name="payment" value="Cash on Delivery" checked class="w-4 h-4 text-brandOrange accent-brandOrange" />
            <span>Cash on Delivery</span>
          </label>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <h2 class="text-sm font-bold text-slate-800 mb-2">Order Summary</h2>
          ${cart.map((item) => `
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">${item.name} × ${item.qty}</span>
              <span class="font-medium text-slate-800">${formatPrice(item.price * item.qty)}</span>
            </div>
          `).join("")}
          <hr class="border-slate-100 my-2"/>
          <div class="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
          <div class="flex justify-between text-sm text-slate-500"><span>Delivery Fee</span><span>${formatPrice(delivery)}</span></div>
          <div class="flex justify-between text-base font-bold text-slate-800"><span>Total</span><span>${formatPrice(total)}</span></div>
        </div>

        <button type="submit" class="w-full bg-brandGreen text-white font-bold text-sm py-4 rounded-xl shadow flex items-center justify-center gap-2 btn-press min-h-[44px]">
          <i class="fa-brands fa-whatsapp text-lg"></i> Order via WhatsApp
        </button>
      </form>
    </div>
  `;
}

export function renderOrderReadyView(orderId, whatsappBlocked = false) {
  const order = getOrderById(orderId);
  if (!order) return renderNotFound();

  return `
    <div class="page-enter app-container px-4 py-8 max-w-lg mx-auto text-center">
      <div class="w-20 h-20 rounded-full bg-emerald-100 text-brandGreen flex items-center justify-center text-3xl mx-auto mb-4">
        <i class="fa-solid fa-check"></i>
      </div>
      <h1 class="text-xl font-bold text-slate-800 mb-2">Order Ready</h1>
      <p class="text-sm text-slate-600 mb-1">Your order <strong>${order.orderId}</strong> has been prepared.</p>
      <p class="text-sm text-slate-500 mb-6">Continue to WhatsApp to send your order.</p>

      ${whatsappBlocked ? `
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
          <p class="text-sm text-amber-800 font-medium mb-2">WhatsApp couldn't open automatically.</p>
          <p class="text-xs text-amber-700">Your order has been saved locally. Tap below to try again.</p>
        </div>
      ` : ""}

      <div class="space-y-3">
        <button type="button" data-action="retry-whatsapp" data-order-id="${orderId}" class="w-full bg-brandGreen text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 btn-press min-h-[44px]">
          <i class="fa-brands fa-whatsapp text-lg"></i> Open WhatsApp Again
        </button>
        <a href="#/order/${orderId}" class="block w-full bg-white border border-slate-200 text-slate-800 font-bold py-3.5 rounded-xl btn-press min-h-[44px] leading-[44px]">View Order</a>
        <a href="#/home" class="block w-full text-brandOrange font-bold py-3 btn-press">Continue Shopping</a>
      </div>
    </div>
  `;
}

export function renderOrdersView() {
  const orders = getOrders();

  if (!orders.length) {
    return `
      <div class="page-enter">
        ${renderEmptyState({
          icon: "fa-receipt",
          title: "No orders yet",
          description: "Your order history will appear here after you place an order.",
          ctaText: "Start Shopping",
          ctaRoute: "#/home",
        })}
      </div>
    `;
  }

  return `
    <div class="page-enter app-container px-4 py-4">
      <h1 class="text-lg font-bold text-slate-800 mb-4">My Orders</h1>
      <div class="space-y-3">
        ${orders.map((o) => renderOrderCard(o)).join("")}
      </div>
    </div>
  `;
}

export function renderOrderDetailView(orderId) {
  const order = getOrderById(orderId);
  if (!order) return renderNotFound();

  return `
    <div class="page-enter app-container px-4 py-4 max-w-2xl">
      <div class="flex items-center gap-3 mb-4">
        <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h1 class="text-lg font-bold text-slate-800">${order.orderId}</h1>
          <p class="text-xs text-slate-400">${formatOrderDate(order.date)}</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-4">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-sm font-bold text-slate-800">Status: ${order.status || "Order Placed"}</h2>
        </div>
        ${renderStatusTimeline(order.statusStep ?? 0)}
        <p class="text-xs text-slate-500 mt-3 leading-relaxed">
          Status sirf aap ke phone par save hota hai — koi server update nahi karta.
          Asal delivery WhatsApp order ke baad store team handle karti hai.
        </p>
        ${(order.statusStep ?? 0) < 4 ? `
          <button type="button" data-action="advance-order-status" data-order-id="${order.orderId}" class="mt-4 w-full bg-orange-50 text-brandOrange border border-orange-100 font-bold py-3 rounded-xl text-sm btn-press min-h-[44px]">
            Demo: Next Status Update
          </button>
        ` : `
          <p class="mt-4 text-sm text-brandGreen font-medium text-center">✓ Delivered (demo)</p>
        `}
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-4 space-y-2">
        <h2 class="text-sm font-bold text-slate-800 mb-2">Items</h2>
        ${order.items.map((item) => `
          <div class="flex justify-between text-sm py-1">
            <span class="text-slate-600">${item.name} × ${item.qty}</span>
            <span class="font-medium">${formatPrice(item.price * item.qty)}</span>
          </div>
        `).join("")}
        <hr class="border-slate-100"/>
        <div class="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
        <div class="flex justify-between text-sm text-slate-500"><span>Delivery</span><span>${formatPrice(order.delivery)}</span></div>
        <div class="flex justify-between text-base font-bold"><span>Total</span><span class="text-brandOrange">${formatPrice(order.total)}</span></div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2 text-sm">
        <h2 class="font-bold text-slate-800 mb-2">Customer Details</h2>
        <p><span class="text-slate-400">Name:</span> ${order.customer.name}</p>
        <p><span class="text-slate-400">Phone:</span> ${order.customer.phone}</p>
        <p><span class="text-slate-400">Address:</span> ${order.customer.address}</p>
        <p><span class="text-slate-400">Area:</span> ${order.customer.area}</p>
        ${order.customer.notes ? `<p><span class="text-slate-400">Notes:</span> ${order.customer.notes}</p>` : ""}
        <p><span class="text-slate-400">Payment:</span> ${order.payment}</p>
      </div>
    </div>
  `;
}

export function renderProfileView() {
  const customer = getStoredCustomer();
  const initials = getCustomerInitials(customer?.name);

  return `
    <div class="page-enter app-container px-4 py-4 max-w-2xl">
      <div class="text-center mb-6">
        <div class="w-20 h-20 rounded-full bg-orange-100 text-brandOrange flex items-center justify-center text-2xl font-bold mx-auto mb-2">${initials}</div>
        <h1 class="text-lg font-bold text-slate-800">${customer?.name || "Guest User"}</h1>
        ${customer?.phone ? `<p class="text-sm text-slate-400">${customer.phone}</p>` : `<p class="text-sm text-slate-400">Complete checkout to save your details</p>`}
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-sm">
        ${renderProfileLink("My Orders", "#/orders", "fa-receipt")}
        ${renderProfileLink("My Favorites", "#/favorites", "fa-heart")}
        ${renderProfileLink("My Addresses", "#/addresses", "fa-location-dot")}
        ${renderProfileLink("Recently Viewed", "#/recently-viewed", "fa-clock-rotate-left")}
        ${renderProfileLink("Help & Support", "#/help", "fa-circle-question")}
        ${renderProfileLink("About ZMart", "#/about", "fa-store")}
        ${renderProfileLink("Privacy Policy", "#/privacy", "fa-shield-halved")}
        ${renderProfileLink("Terms & Conditions", "#/terms", "fa-file-lines")}
      </div>
    </div>
  `;
}

function renderProfileLink(label, route, icon) {
  return `
    <a href="${route}" class="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors min-h-[44px]">
      <span class="flex items-center gap-3 text-sm text-slate-700">
        <i class="fa-solid ${icon} text-brandOrange w-5 text-center"></i>
        ${label}
      </span>
      <i class="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
    </a>
  `;
}

export function renderFavoritesView() {
  const favIds = getStoredFavorites();
  const products = getProductsByIds(favIds);

  if (!products.length) {
    return `
      <div class="page-enter">
        ${renderEmptyState({
          icon: "fa-heart",
          title: "No favorites yet",
          description: "Tap the heart icon on products you love!",
          ctaText: "Browse Products",
          ctaRoute: "#/categories",
        })}
      </div>
    `;
  }

  return `
    <div class="page-enter app-container px-4 py-4">
      <div class="flex items-center gap-3 mb-4">
        <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 class="text-lg font-bold text-slate-800">My Favorites</h1>
      </div>
      ${renderProductGrid(products)}
    </div>
  `;
}

export function renderRecentlyViewedView() {
  const ids = getRecentlyViewed();
  const products = getProductsByIds(ids);

  if (!products.length) {
    return `
      <div class="page-enter">
        ${renderEmptyState({
          icon: "fa-clock-rotate-left",
          title: "No recently viewed",
          description: "Products you view will appear here.",
          ctaText: "Start Shopping",
          ctaRoute: "#/home",
        })}
      </div>
    `;
  }

  return `
    <div class="page-enter app-container px-4 py-4">
      <div class="flex items-center gap-3 mb-4">
        <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 class="text-lg font-bold text-slate-800">Recently Viewed</h1>
      </div>
      ${renderProductGrid(products)}
    </div>
  `;
}

export function renderAddressesView() {
  const addresses = getStoredAddresses();

  return `
    <div class="page-enter app-container px-4 py-4 max-w-2xl">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press" aria-label="Go back">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <h1 class="text-lg font-bold text-slate-800">My Addresses</h1>
        </div>
        <button type="button" data-action="add-address" class="text-sm text-brandOrange font-bold btn-press">+ Add</button>
      </div>

      ${addresses.length ? `
        <div class="space-y-3">
          ${addresses.map((addr) => `
            <div class="bg-white p-4 rounded-2xl border ${addr.isDefault ? "border-brandOrange" : "border-slate-100"} shadow-sm">
              <div class="flex justify-between items-start mb-1">
                <span class="text-sm font-bold text-slate-800">${addr.label || "Address"}</span>
                ${addr.isDefault ? `<span class="text-[10px] bg-orange-100 text-brandOrange px-2 py-0.5 rounded-full font-bold">Default</span>` : ""}
              </div>
              <p class="text-sm text-slate-600">${addr.address}</p>
              <p class="text-xs text-slate-400">${addr.area}</p>
              <div class="flex gap-3 mt-3">
                <button type="button" data-action="edit-address" data-id="${addr.id}" class="text-xs text-brandOrange font-medium btn-press">Edit</button>
                ${!addr.isDefault ? `<button type="button" data-action="set-default-address" data-id="${addr.id}" class="text-xs text-slate-500 font-medium btn-press">Set Default</button>` : ""}
                <button type="button" data-action="delete-address" data-id="${addr.id}" class="text-xs text-red-500 font-medium btn-press">Delete</button>
              </div>
            </div>
          `).join("")}
        </div>
      ` : renderEmptyState({
          icon: "fa-location-dot",
          title: "No saved addresses",
          description: "Add an address for faster checkout.",
          ctaText: "Add Address",
          ctaAction: "add-address",
        })}
    </div>
  `;
}

export function renderNotificationsView() {
  const notifications = getNotifications();

  return `
    <div class="page-enter app-container px-4 py-4 max-w-2xl">
      <div class="flex items-center gap-3 mb-4">
        <button type="button" data-action="go-back" class="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full hover:bg-slate-100 btn-press" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 class="text-lg font-bold text-slate-800">Notifications</h1>
      </div>
      ${notifications.length ? `
        <div class="space-y-2">
          ${notifications.map((n) => `
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm ${n.read ? "opacity-60" : ""}">
              <p class="text-sm font-medium text-slate-800">${n.title}</p>
              <p class="text-xs text-slate-500 mt-0.5">${n.message}</p>
              <p class="text-[10px] text-slate-400 mt-1">${new Date(n.date).toLocaleString()}</p>
            </div>
          `).join("")}
        </div>
      ` : renderEmptyState({
          icon: "fa-bell",
          title: "No notifications",
          description: "Cart reminders and order updates will appear here.",
          ctaText: "",
          ctaRoute: "",
        })}
    </div>
  `;
}

export function renderHelpView() {
  return renderStaticPage("Help & Support", `
    <p>Need help with your order? Contact us via WhatsApp at <strong>0312-3743909</strong>.</p>
    <p class="mt-3">Our team is available daily from 9 AM to 9 PM.</p>
    <a href="https://wa.me/923123743909" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-4 bg-brandGreen text-white px-4 py-2 rounded-xl text-sm font-bold">
      <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
    </a>
  `);
}

export function renderAboutView() {
  return renderStaticPage("About ZMart", `
    <p><strong>ZMart</strong> is your neighborhood grocery delivery app. We bring fresh groceries to your doorstep quickly and conveniently.</p>
    <p class="mt-3">All orders are placed via WhatsApp and fulfilled by our local team. No account required — just shop, checkout, and send your order!</p>
  `);
}

export function renderPrivacyView() {
  return renderStaticPage("Privacy Policy", `
    <p>Your data is stored locally on your device for convenience (cart, favorites, addresses, order history). We do not transmit personal data to any server.</p>
    <p class="mt-3">When you place an order, your details are sent directly to us via WhatsApp. Please review WhatsApp's privacy policy for message handling.</p>
  `);
}

export function renderTermsView() {
  return renderStaticPage("Terms & Conditions", `
    <p>By using ZMart, you agree to place orders via WhatsApp. Prices and availability are subject to change.</p>
    <p class="mt-3">Delivery times are estimates. Payment is cash on delivery unless otherwise agreed.</p>
  `);
}

export function renderNotFound() {
  return `
    <div class="page-enter">
      ${renderEmptyState({
        icon: "fa-circle-exclamation",
        title: "Page not found",
        description: "The page you're looking for doesn't exist.",
        ctaText: "Go Home",
        ctaRoute: "#/home",
      })}
    </div>
  `;
}

export function getSortFilterModalContent(categoryId, type) {
  const state = categoryState[categoryId] || { sort: "popular", filters: [] };

  if (type === "sort") {
    return SORT_OPTIONS.map(
      (opt) => `
      <label class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer min-h-[44px]">
        <input type="radio" name="sort" value="${opt.id}" ${state.sort === opt.id ? "checked" : ""} class="accent-brandOrange"/>
        <span class="text-sm text-slate-700">${opt.label}</span>
      </label>
    `
    ).join("");
  }

  return FILTER_OPTIONS.map(
    (opt) => `
    <label class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer min-h-[44px]">
      <input type="checkbox" name="filter" value="${opt.id}" ${state.filters.includes(opt.id) ? "checked" : ""} class="accent-brandOrange rounded"/>
      <span class="text-sm text-slate-700">${opt.label}</span>
    </label>
  `
  ).join("");
}

export function renderAddressForm(address = null) {
  return `
    <form id="address-form" class="space-y-3">
      <div>
        <label class="text-xs font-medium text-slate-600 block mb-1">Label</label>
        <input type="text" name="label" value="${address?.label || ""}" placeholder="Home, Office..." class="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
      </div>
      <div>
        <label class="text-xs font-medium text-slate-600 block mb-1">Complete Address</label>
        <input type="text" name="address" value="${address?.address || ""}" placeholder="House #, Street, Block" class="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
      </div>
      <div>
        <label class="text-xs font-medium text-slate-600 block mb-1">Area</label>
        <input type="text" name="area" value="${address?.area || ""}" placeholder="Area, City" class="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
      </div>
      <label class="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" name="isDefault" ${address?.isDefault ? "checked" : ""} class="accent-brandOrange rounded"/>
        Set as default address
      </label>
    </form>
  `;
}

export function renderAddressSelectModal(addresses) {
  return addresses.map(
    (addr) => `
    <button type="button" data-action="use-address" data-id="${addr.id}" class="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-brandOrange mb-2 btn-press">
      <span class="text-sm font-bold text-slate-800">${addr.label || "Address"}</span>
      <p class="text-xs text-slate-500">${addr.address}, ${addr.area}</p>
    </button>
  `
  ).join("");
}

export function renderCartDrawerContent() {
  const cart = getCart();
  const { subtotal, delivery, total } = getCartTotals();

  if (!cart.length) {
    return `<p class="text-sm text-slate-400 text-center py-8">Your cart is empty</p>`;
  }

  return `
    <div class="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
      ${cart.map((item) => renderCartItem(item)).join("")}
    </div>
    <div class="border-t border-slate-100 pt-3 mt-3 space-y-2">
      <div class="flex justify-between text-sm"><span>Total</span><span class="font-bold">${formatPrice(total)}</span></div>
      <a href="#/cart" data-action="close-drawer" class="block w-full bg-brandOrange text-white text-center font-bold py-3 rounded-xl btn-press">View Cart</a>
    </div>
  `;
}
