import { ZMART_CONFIG } from "./config.js";

const keys = ZMART_CONFIG.storageKeys;

export function getStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function isStorageAvailable() {
  try {
    const test = "__zmart_test__";
    localStorage.setItem(test, "1");
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Cart
export function getStoredCart() {
  return getStorage(keys.cart, []);
}

export function saveCart(cart) {
  return setStorage(keys.cart, cart);
}

// Orders
export function getStoredOrders() {
  return getStorage(keys.orders, []);
}

export function saveOrders(orders) {
  return setStorage(keys.orders, orders);
}

// Favorites
export function getStoredFavorites() {
  return getStorage(keys.favorites, []);
}

export function saveFavorites(favorites) {
  return setStorage(keys.favorites, favorites);
}

// Recent searches
export function getRecentSearches() {
  return getStorage(keys.recentSearches, []);
}

export function saveRecentSearches(searches) {
  return setStorage(keys.recentSearches, searches);
}

// Addresses
export function getStoredAddresses() {
  return getStorage(keys.addresses, []);
}

export function saveAddresses(addresses) {
  return setStorage(keys.addresses, addresses);
}

// Customer
export function getStoredCustomer() {
  return getStorage(keys.customer, null);
}

export function saveCustomer(customer) {
  return setStorage(keys.customer, customer);
}

// Recently viewed
export function getRecentlyViewed() {
  return getStorage(keys.recentlyViewed, []);
}

export function saveRecentlyViewed(ids) {
  return setStorage(keys.recentlyViewed, ids);
}

// Notifications (local only)
export function getNotifications() {
  return getStorage(keys.notifications, []);
}

export function saveNotifications(notifications) {
  return setStorage(keys.notifications, notifications);
}
