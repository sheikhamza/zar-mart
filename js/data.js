export const categories = [
  { id: "1", name: "Aata & Grains", icon: "fa-cheese" },
  { id: "2", name: "Daalain & Pulses", icon: "fa-bread-slice" },
  { id: "3", name: "Masalay & Namak", icon: "fa-mug-hot" },
  { id: "4", name: "Cooking Oil & Ghee", icon: "fa-cookie-bite" },
  { id: "5", name: "Breakfast", icon: "fa-egg" },
];

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`;

export const products = [
  // 1
  { id: 1, name: "Chakki Atta", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1610725664285-7c57e6eeac3f"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 2, name: "Fine Atta", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1610725664285-7c57e6eeac3f"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 3, name: "Maida", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1563636619-e9143da7973b"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 4, name: "Suji", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1563636619-e9143da7973b"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 5, name: "Besan", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1563636619-e9143da7973b"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 6, name: "Basmati Rice", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1723475158229-894679ca024e"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 7, name: "Sella Rice", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1723475158229-894679ca024e"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 8, name: "Broken Rice", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1723475158229-894679ca024e"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 9, name: "Daliya", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1563636619-e9143da7973b"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  { id: 10, name: "Corn Flour", category: "1", price: 180, oldPrice: 200, discount: 10, unit: "1 KG", image: img("1563636619-e9143da7973b"), description: "Fresh and pure milk. Good for health and strong bones.", stock: true, popular: true, featured: true, tags: ["fresh", "daily", "milk"] },
  // Daalain & Pulses
  { id: 11, name: "Masoor Daal", category: "2", price: 120, oldPrice: 140, discount: 14, unit: "Loaf", image: img("1701064865147-48dcd4d63015"), description: "Soft and fresh white bread baked daily.", stock: true, popular: true, featured: true, tags: ["bread", "2", "fresh"] },
  { id: 12, name: "Moong Daal", category: "2", price: 120, oldPrice: 140, discount: 14, unit: "Loaf", image: img("1702041357314-db5826c96f04"), description: "Soft and fresh white bread baked daily.", stock: true, popular: true, featured: true, tags: ["bread", "2", "fresh"] },
  { id: 13, name: "Chana Daal", category: "2", price: 120, oldPrice: 140, discount: 14, unit: "Loaf", image: img("1612869538502-b5baa439abd7"), description: "Soft and fresh white bread baked daily.", stock: true, popular: true, featured: true, tags: ["bread", "2", "fresh"] },
  { id: 14, name: "Mash Daal", category: "2", price: 120, oldPrice: 140, discount: 14, unit: "Loaf", image: img("1705146640334-1277c28ddd1a"), description: "Soft and fresh white bread baked daily.", stock: true, popular: true, featured: true, tags: ["bread", "2", "fresh"] },
  { id: 15, name: "Arhar/Toor Daal", category: "2", price: 120, oldPrice: 140, discount: 14, unit: "Loaf", image: img("1509440159596-0249088772ff"), description: "Soft and fresh white bread baked daily.", stock: true, popular: true, featured: true, tags: ["bread", "2", "fresh"] },
  { id: 16, name: "White Chana", category: "2", price: 120, oldPrice: 140, discount: 14, unit: "Loaf", image: img("1509440159596-0249088772ff"), description: "Soft and fresh white bread baked daily.", stock: true, popular: true, featured: true, tags: ["bread", "2", "fresh"] },
  { id: 17, name: "Black Chana", category: "2", price: 120, oldPrice: 140, discount: 14, unit: "Loaf", image: img("1509440159596-0249088772ff"), description: "Soft and fresh white bread baked daily.", stock: true, popular: true, featured: true, tags: ["bread", "2", "fresh"] },
  { id: 18, name: "Lobia", category: "2", price: 120, oldPrice: 140, discount: 14, unit: "Loaf", image: img("1509440159596-0249088772ff"), description: "Soft and fresh white bread baked daily.", stock: true, popular: true, featured: true, tags: ["bread", "2", "fresh"] },
  // Masalay & Namak
  { id: 19, name: "Lal Mirch Powder", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1607672632458-9eb56696346b"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  { id: 20, name: "Haldi", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1726862790171-0d6208559224"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  { id: 21, name: "Dhania Powder", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1600271886742-f98f9d7c0a0e"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  { id: 22, name: "Zeera", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1600271886742-f98f9d7c0a0e"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  { id: 23, name: "Garam Masala", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1600271886742-f98f9d7c0a0e"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  { id: 24, name: "Chaat Masala", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1600271886742-f98f9d7c0a0e"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  { id: 25, name: "Biryani Masala", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1600271886742-f98f9d7c0a0e"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  { id: 26, name: "Karahi Masala", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1600271886742-f98f9d7c0a0e"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  { id: 27, name: "Chicken Masala", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1600271886742-f98f9d7c0a0e"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  { id: 28, name: "Namak", category: "3", price: 220, oldPrice: 250, discount: 12, unit: "1 Liter", image: img("1600271886742-f98f9d7c0a0e"), description: "100%.", stock: true, popular: true, featured: true, tags: ["juice"] },
  // Cooking Oil & Ghee
  { id: 29, name: "Cooking Oil", category: "4", price: 80, oldPrice: 90, discount: 11, unit: "150g", image: img("1566478983877-231106549c1d"), description: "Crispy salted potato chips.", stock: true, popular: true, featured: true, tags: ["chips", "4"] },
  { id: 30, name: "Banaspati Ghee", category: "4", price: 80, oldPrice: 90, discount: 11, unit: "150g", image: img("1566478983877-231106549c1d"), description: "Crispy salted potato chips.", stock: true, popular: true, featured: true, tags: ["chips", "4"] },
  { id: 31, name: "Coconut Oil", category: "4", price: 80, oldPrice: 90, discount: 11, unit: "150g", image: img("1566478983877-231106549c1d"), description: "Crispy salted potato chips.", stock: true, popular: true, featured: true, tags: ["chips", "4"] },
  // Breakfast
  { id: 32, name: "Egg", category: "5", price: 380, oldPrice: 420, discount: 10, unit: "500g", image: img("1726072360068-cdc3561ea615"), description: "Crispy corn flakes cereal for breakfast.", stock: true, popular: true, featured: true, tags: ["cereal", "breakfast"] },
];

export function getCategoryById(id) {
  return categories.find((c) => c.id === id);
}
