import { ZMART_CONFIG } from "./config.js";

export function normalizePhone(input) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 11) return "92" + digits.slice(1);
  if (digits.length === 10 && digits.startsWith("3")) return "92" + digits;
  return null;
}

export function formatPhoneDisplay(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return phone;
  return "0" + normalized.slice(2);
}

export function validatePhone(input) {
  return normalizePhone(input) !== null;
}

export function buildWhatsAppMessage(order) {
  const { orderId, customer, items, subtotal, delivery, total, payment } = order;
  const lines = [
    `🛒 NEW ORDER - ${ZMART_CONFIG.storeName.toUpperCase()}`,
    "",
    `Order ID: ${orderId}`,
    "",
    "Customer Details",
    `Name: ${customer.name}`,
    `Phone: ${formatPhoneDisplay(customer.phone)}`,
    `Address: ${customer.address}`,
    `Area: ${customer.area}`,
    customer.notes ? `Notes: ${customer.notes}` : null,
    "",
    "Order Items",
    "",
  ].filter(Boolean);

  items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.name} x${item.qty} — Rs. ${item.price * item.qty}`);
  });

  lines.push(
    "",
    `Subtotal: Rs. ${subtotal}`,
    `Delivery: Rs. ${delivery}`,
    `Total: Rs. ${total}`,
    "",
    "Payment:",
    payment,
    "",
    `Thank you for shopping with ${ZMART_CONFIG.storeName}!`
  );

  return lines.join("\n");
}

export function getWhatsAppUrl(message) {
  return `https://wa.me/${ZMART_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message) {
  const url = getWhatsAppUrl(message);
  const win = window.open(url, "_blank");
  return !!win;
}
