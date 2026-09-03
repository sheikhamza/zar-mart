import { products, getCategoryById } from "./data.js";

export function getAllProducts() {
  return products;
}

export function getProductById(id) {
  return products.find((p) => p.id === Number(id));
}

export function getProductsByCategory(categoryId) {
  return products.filter((p) => p.category === categoryId);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured && p.stock);
}

export function getPopularProducts() {
  return products.filter((p) => p.popular && p.stock);
}

export function getDealsProducts() {
  return products.filter((p) => p.discount > 0 && p.stock);
}

export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id && p.stock)
    .slice(0, limit);
}

export function searchProducts(query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return products.filter((p) => {
    const cat = getCategoryById(p.category);
    const catName = cat ? cat.name.toLowerCase() : "";
    const tagMatch = p.tags.some((t) => t.toLowerCase().includes(q));
    return (
      p.name.toLowerCase().includes(q) ||
      catName.includes(q) ||
      p.description.toLowerCase().includes(q) ||
      tagMatch
    );
  });
}

export function sortProducts(list, sortId) {
  const sorted = [...list];
  switch (sortId) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "popular":
      return sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    case "discount":
      return sorted.sort((a, b) => b.discount - a.discount);
    default:
      return sorted;
  }
}

export function filterProducts(list, filters) {
  let result = [...list];
  if (filters.includes("under-500")) {
    result = result.filter((p) => p.price < 500);
  }
  if (filters.includes("discounted")) {
    result = result.filter((p) => p.discount > 0);
  }
  if (filters.includes("available")) {
    result = result.filter((p) => p.stock);
  }
  return result;
}

export function getProductsByIds(ids) {
  return ids.map((id) => getProductById(id)).filter(Boolean);
}

export function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function getCategoryName(categoryId) {
  const cat = getCategoryById(categoryId);
  return cat ? cat.name : categoryId;
}
