import { ZMART_CONFIG } from "./config.js";
import { getStoredCart, saveCart } from "./storage.js";
import { getProductById } from "./products.js";

export function getCart() {
  return getStoredCart();
}

export function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemDiscount = cart.reduce((sum, item) => {
    if (item.oldPrice && item.oldPrice > item.price) {
      return sum + (item.oldPrice - item.price) * item.qty;
    }
    return sum;
  }, 0);
  const delivery = subtotal > 0 ? ZMART_CONFIG.deliveryFee : 0;
  const total = subtotal + delivery;
  return { subtotal, delivery, total, itemDiscount, count: cart.length };
}

export function addToCart(productId, qty = 1) {
  const product = getProductById(productId);
  if (!product || !product.stock) return null;

  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      unit: product.unit,
      image: product.image,
      qty,
    });
  }

  saveCart(cart);
  return { product, cart };
}

export function updateCartQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return cart;

  item.qty += delta;
  if (item.qty <= 0) {
    return removeFromCart(productId);
  }

  saveCart(cart);
  return cart;
}

export function setCartQty(productId, qty) {
  if (qty <= 0) return removeFromCart(productId);
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.qty = qty;
    saveCart(cart);
  }
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.id !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
  return [];
}

export function isCartEmpty() {
  return getCart().length === 0;
}
