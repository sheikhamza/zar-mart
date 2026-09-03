import { getRecentSearches, saveRecentSearches } from "./storage.js";
import { searchProducts } from "./products.js";

const MAX_RECENT = 8;

export function performSearch(query) {
  return searchProducts(query);
}

export function addRecentSearch(query) {
  if (!query || !query.trim()) return;
  const trimmed = query.trim();
  let recent = getRecentSearches().filter(
    (s) => s.toLowerCase() !== trimmed.toLowerCase()
  );
  recent.unshift(trimmed);
  recent = recent.slice(0, MAX_RECENT);
  saveRecentSearches(recent);
}

export function clearRecentSearches() {
  saveRecentSearches([]);
}

export function getRecentSearchList() {
  return getRecentSearches();
}
