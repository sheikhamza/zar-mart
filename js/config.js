export const ZMART_CONFIG = {
  storeName: "ZMart",
  whatsappNumber: "923123743909",
  deliveryFee: 70,
  currency: "Rs.",
  popularSearches: ["Milk", "Bread", "Eggs", "Rice", "Oil", "Tea"],
  storageKeys: {
    cart: "zmart_cart",
    orders: "zmart_orders",
    favorites: "zmart_favorites",
    recentSearches: "zmart_recent_searches",
    addresses: "zmart_addresses",
    customer: "zmart_customer",
    recentlyViewed: "zmart_recently_viewed",
    notifications: "zmart_notifications",
  },
};

export const SORT_OPTIONS = [
  { id: "price-asc", label: "Price Low → High" },
  { id: "price-desc", label: "Price High → Low" },
  { id: "name-asc", label: "Name A → Z" },
  { id: "popular", label: "Popular" },
  { id: "discount", label: "Discount" },
];

export const FILTER_OPTIONS = [
  { id: "under-500", label: "Under Rs. 500" },
  { id: "discounted", label: "Discounted" },
  { id: "available", label: "Available" },
];

export const ORDER_STATUSES = [
  "Order Placed",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];
