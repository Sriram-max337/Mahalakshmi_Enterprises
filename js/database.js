/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * LocalStorage Database Layer
 * Centralized CRUD, Schema Seeding, and State Management
 */

const DB_KEYS = {
  SETTINGS: "mahalaxmi_settings",
  WHATSAPP: "mahalaxmi_whatsapp",
  BANNERS: "mahalaxmi_banners",
  CATEGORIES: "mahalaxmi_categories",
  PRODUCTS: "mahalaxmi_products",
  SERVICES: "mahalaxmi_services",
  SOLAR: "mahalaxmi_solar",
  ENQUIRIES: "mahalaxmi_enquiries",
  SERVICE_REQUESTS: "mahalaxmi_service_requests",
  CUSTOMERS: "mahalaxmi_customers",
  FAQ: "mahalaxmi_faq",
  CART: "mahalaxmi_cart",
  COMPARE: "mahalaxmi_compare"
};

const DB = {
  /**
   * Initialize LocalStorage with default seeds if not present
   */
  init: function () {
    if (typeof localStorage === "undefined") return;

    if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
      this.setRaw(DB_KEYS.SETTINGS, DEFAULT_CONFIG.settings);
    } else {
      const currSettings = this.getRaw(DB_KEYS.SETTINGS);
      if (currSettings && (currSettings.whatsapp === "919845012345" || currSettings.phoneClean === "919845012345" || !currSettings.phone)) {
        currSettings.phone = "+91 97014 10661";
        currSettings.phoneClean = "919701410661";
        currSettings.whatsapp = "919701410661";
        currSettings.address = "Karimnagar, Telangana, India";
        this.setRaw(DB_KEYS.SETTINGS, currSettings);
      }
    }
    if (!localStorage.getItem(DB_KEYS.WHATSAPP)) {
      this.setRaw(DB_KEYS.WHATSAPP, DEFAULT_CONFIG.whatsapp);
    } else {
      const currWa = this.getRaw(DB_KEYS.WHATSAPP);
      if (currWa && (currWa.number === "919845012345" || !currWa.number)) {
        currWa.number = "919701410661";
        this.setRaw(DB_KEYS.WHATSAPP, currWa);
      }
    }
    if (!localStorage.getItem(DB_KEYS.BANNERS)) {
      this.setRaw(DB_KEYS.BANNERS, DEFAULT_CONFIG.banners);
    }
    if (!localStorage.getItem(DB_KEYS.CATEGORIES)) {
      this.setRaw(DB_KEYS.CATEGORIES, DEFAULT_CONFIG.categories);
    }
    if (!localStorage.getItem(DB_KEYS.PRODUCTS)) {
      this.setRaw(DB_KEYS.PRODUCTS, DEFAULT_CONFIG.products);
    }
    if (!localStorage.getItem(DB_KEYS.SERVICES)) {
      this.setRaw(DB_KEYS.SERVICES, DEFAULT_CONFIG.services);
    }
    if (!localStorage.getItem(DB_KEYS.SOLAR)) {
      this.setRaw(DB_KEYS.SOLAR, DEFAULT_CONFIG.solar);
    }
    if (!localStorage.getItem(DB_KEYS.FAQ)) {
      this.setRaw(DB_KEYS.FAQ, DEFAULT_CONFIG.faqs);
    }
    if (!localStorage.getItem(DB_KEYS.ENQUIRIES)) {
      this.setRaw(DB_KEYS.ENQUIRIES, DEFAULT_CONFIG.enquiries);
    }
    if (!localStorage.getItem(DB_KEYS.SERVICE_REQUESTS)) {
      this.setRaw(DB_KEYS.SERVICE_REQUESTS, DEFAULT_CONFIG.serviceRequests);
    }
    if (!localStorage.getItem(DB_KEYS.CUSTOMERS)) {
      this.setRaw(DB_KEYS.CUSTOMERS, DEFAULT_CONFIG.customers);
    }
    if (!localStorage.getItem(DB_KEYS.CART)) {
      this.setRaw(DB_KEYS.CART, []);
    }
    if (!localStorage.getItem(DB_KEYS.COMPARE)) {
      this.setRaw(DB_KEYS.COMPARE, []);
    }
  },

  getRaw: function (key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from LocalStorage`, e);
      return fallback;
    }
  },

  setRaw: function (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.dispatchUpdate(key, value);
      return true;
    } catch (e) {
      console.error(`Error saving ${key} to LocalStorage`, e);
      return false;
    }
  },

  // Event dispatcher for cross-component sync
  dispatchUpdate: function (key, value) {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("mahalaxmi_db_update", { detail: { key, value } });
      window.dispatchEvent(event);
    }
  },

  /**
   * Generic CRUD methods for collection arrays
   */
  getAll: function (collectionKey) {
    return this.getRaw(collectionKey, []);
  },

  getById: function (collectionKey, id) {
    const items = this.getAll(collectionKey);
    return items.find(item => String(item.id) === String(id)) || null;
  },

  insert: function (collectionKey, item) {
    const items = this.getAll(collectionKey);
    if (!item.id) {
      item.id = "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);
    }
    if (!item.createdAt) {
      item.createdAt = new Date().toISOString();
    }
    items.unshift(item);
    this.setRaw(collectionKey, items);
    return item;
  },

  update: function (collectionKey, id, updates) {
    const items = this.getAll(collectionKey);
    const index = items.findIndex(item => String(item.id) === String(id));
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
      this.setRaw(collectionKey, items);
      return items[index];
    }
    return null;
  },

  delete: function (collectionKey, id) {
    const items = this.getAll(collectionKey);
    const filtered = items.filter(item => String(item.id) !== String(id));
    this.setRaw(collectionKey, filtered);
    return true;
  },

  // Specific Getters & Setters
  getSettings: function () {
    return this.getRaw(DB_KEYS.SETTINGS, DEFAULT_CONFIG.settings);
  },

  saveSettings: function (newSettings) {
    return this.setRaw(DB_KEYS.SETTINGS, newSettings);
  },

  getWhatsAppConfig: function () {
    return this.getRaw(DB_KEYS.WHATSAPP, DEFAULT_CONFIG.whatsapp);
  },

  saveWhatsAppConfig: function (newConfig) {
    return this.setRaw(DB_KEYS.WHATSAPP, newConfig);
  },

  getProducts: function () {
    return this.getAll(DB_KEYS.PRODUCTS);
  },

  getCategories: function () {
    return this.getAll(DB_KEYS.CATEGORIES);
  },

  getServices: function () {
    return this.getAll(DB_KEYS.SERVICES);
  },

  getSolar: function () {
    return this.getAll(DB_KEYS.SOLAR);
  },

  getBanners: function () {
    return this.getAll(DB_KEYS.BANNERS);
  },

  getFaqs: function () {
    return this.getAll(DB_KEYS.FAQ);
  },

  getEnquiries: function () {
    return this.getAll(DB_KEYS.ENQUIRIES);
  },

  getServiceRequests: function () {
    return this.getAll(DB_KEYS.SERVICE_REQUESTS);
  },

  getCustomers: function () {
    return this.getAll(DB_KEYS.CUSTOMERS);
  },

  /**
   * Enquiry Cart Management
   */
  getCart: function () {
    return this.getRaw(DB_KEYS.CART, []);
  },

  addToCart: function (product, quantity = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += Number(quantity);
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        model: product.model || "",
        category: product.category,
        capacity: product.capacity || "",
        image: (product.images && product.images[0]) ? product.images[0] : (product.image_url || product.image || "assets/products/ro-pure-copper.svg"),
        quantity: Number(quantity)
      });
    }
    this.setRaw(DB_KEYS.CART, cart);
    return cart;
  },

  updateCartQty: function (productId, quantity) {
    let cart = this.getCart();
    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      return this.removeFromCart(productId);
    }
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity = qty;
      this.setRaw(DB_KEYS.CART, cart);
    }
    return cart;
  },

  removeFromCart: function (productId) {
    const cart = this.getCart().filter(i => i.id !== productId);
    this.setRaw(DB_KEYS.CART, cart);
    return cart;
  },

  clearCart: function () {
    this.setRaw(DB_KEYS.CART, []);
    return [];
  },

  /**
   * Product Comparison Management (Max 4 items)
   */
  getCompare: function () {
    return this.getRaw(DB_KEYS.COMPARE, []);
  },

  addToCompare: function (product) {
    const compare = this.getCompare();
    if (compare.some(p => p.id === product.id)) {
      return { success: false, message: "Product is already in comparison list." };
    }
    if (compare.length >= 4) {
      return { success: false, message: "You can compare a maximum of 4 products at a time." };
    }
    compare.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      model: product.model || "",
      category: product.category,
      purificationTechnology: product.purificationTechnology || "N/A",
      capacity: product.capacity || "N/A",
      suitableFor: product.suitableFor || "N/A",
      features: product.features || [],
      specifications: product.specifications || {},
      warranty: product.warranty || "Standard Warranty",
      installation: product.installation || "Standard Installation",
      serviceInfo: product.serviceInfo || "Standard Service",
      image: (product.images && product.images[0]) ? product.images[0] : (product.image_url || product.image || "assets/products/ro-pure-copper.svg")
    });
    this.setRaw(DB_KEYS.COMPARE, compare);
    return { success: true, message: `"${product.name}" added to comparison!` };
  },

  removeFromCompare: function (productId) {
    const compare = this.getCompare().filter(p => p.id !== productId);
    this.setRaw(DB_KEYS.COMPARE, compare);
    return compare;
  },

  clearCompare: function () {
    this.setRaw(DB_KEYS.COMPARE, []);
    return [];
  },

  /**
   * Factory Reset & Backup
   */
  resetToDefault: function () {
    if (typeof localStorage === "undefined") return;
    Object.values(DB_KEYS).forEach(k => localStorage.removeItem(k));
    this.init();
    return true;
  },

  exportAll: function () {
    const dump = {};
    Object.entries(DB_KEYS).forEach(([name, key]) => {
      dump[key] = this.getRaw(key);
    });
    return JSON.stringify(dump, null, 2);
  },

  importAll: function (jsonString) {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, val]) => {
        if (Object.values(DB_KEYS).includes(key)) {
          this.setRaw(key, val);
        }
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

// Auto-run DB init on script load
DB.init();

// Export globally
if (typeof window !== "undefined") {
  window.DB = DB;
  window.DB_KEYS = DB_KEYS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { DB, DB_KEYS };
}
