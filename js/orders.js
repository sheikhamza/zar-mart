import { getStoredOrders, saveOrders } from "./storage.js";

export function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ZM-${date}-${random}`;
}

export const ORDER_STATUS_STEPS = [
  "Order Placed",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

export function createOrder(orderData) {
  const orders = getStoredOrders();
  const order = {
    ...orderData,
    date: new Date().toISOString(),
    status: "Order Placed",
    statusStep: 0,
  };
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

export function advanceOrderStatus(orderId) {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index === -1) return null;

  const order = orders[index];
  const currentStep = order.statusStep ?? 0;
  if (currentStep >= ORDER_STATUS_STEPS.length - 1) return order;

  order.statusStep = currentStep + 1;
  order.status = ORDER_STATUS_STEPS[order.statusStep];
  orders[index] = order;
  saveOrders(orders);
  return order;
}

export function getStatusLabel(statusStep) {
  return ORDER_STATUS_STEPS[statusStep] || "Order Placed";
}

export function getOrders() {
  return getStoredOrders();
}

export function getOrderById(orderId) {
  return getStoredOrders().find((o) => o.orderId === orderId);
}

export function formatOrderDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
