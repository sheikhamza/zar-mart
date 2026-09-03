const routes = {};
let currentRoute = null;
let routeParams = {};
let routeHandler = null;
let onRouteChangeCallback = null;

export function registerRoute(pattern, handler) {
  routes[pattern] = handler;
}

function dispatchRoute() {
  const hash = window.location.hash || "#/home";
  const { handler, params, path } = matchRoute(hash);
  currentRoute = path;
  routeParams = params;
  if (handler) {
    routeHandler = handler;
    handler(params);
  }
  if (onRouteChangeCallback) onRouteChangeCallback(path, params);
}

/** Navigate to a route. Pass force=true to re-render even if hash is unchanged. */
export function navigate(path, force = false) {
  const newHash = path.startsWith("#") ? path : `#${path}`;
  if (window.location.hash === newHash) {
    if (force) dispatchRoute();
    return;
  }
  window.location.hash = newHash;
}

/** Re-render the current route without changing the URL. */
export function refreshRoute() {
  dispatchRoute();
}

export function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigate("/home");
  }
}

export function getCurrentRoute() {
  return currentRoute;
}

export function getRouteParams() {
  return routeParams;
}

function matchRoute(hash) {
  const path = hash.replace(/^#/, "") || "/home";

  for (const pattern of Object.keys(routes)) {
    const paramNames = [];
    const regexStr = pattern.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
    const regex = new RegExp(`^${regexStr}$`);
    const match = path.match(regex);

    if (match) {
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler: routes[pattern], params, path: path.split("/")[1] || "home" };
    }
  }

  return { handler: routes["/home"], params: {}, path: "home" };
}

export function initRouter(onRouteChange) {
  onRouteChangeCallback = onRouteChange;

  window.addEventListener("hashchange", dispatchRoute);
  window.addEventListener("load", dispatchRoute);

  if (!window.location.hash) {
    window.location.hash = "#/home";
  }
}

export function getActiveTab(route) {
  const tabMap = {
    home: "home",
    categories: "categories",
    category: "categories",
    product: "home",
    search: "home",
    cart: "cart",
    checkout: "cart",
    orders: "orders",
    order: "orders",
    "order-ready": "orders",
    profile: "profile",
    favorites: "profile",
    addresses: "profile",
    "recently-viewed": "profile",
    help: "profile",
    about: "profile",
    privacy: "profile",
    terms: "profile",
    notifications: "home",
    products: "home",
    deals: "home",
    popular: "home",
  };
  return tabMap[route] || "home";
}
