/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Products Catalogue: Supabase Data Source + Search, Filter, Sort & Grid Rendering
 */

const PRODUCT_PLACEHOLDER = "assets/products/ro-pure-copper.svg";

const ProductsModule = {
  products: [],
  filteredProducts: [],
  activeFilters: {
    search: "",
    category: [],
    brand: [],
    availability: []
  },
  currentSort: "featured",

  init: async function () {
    await this.loadProducts();
    this.readUrlParams();
    this.populateFilterOptions();
    this.applyFiltersAndSort();
    this.bindEvents();
  },

  /**
   * Fetch the product array from Supabase (public read via RLS).
   */
  loadProducts: async function () {
    this.products = await fetchAllProducts();
  },

  readUrlParams: function () {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const search = params.get("search");

    if (cat) {
      this.activeFilters.category = [decodeURIComponent(cat)];
    }
    if (search) {
      this.activeFilters.search = decodeURIComponent(search);
      const searchInput = document.getElementById("catalogSearchInput");
      if (searchInput) searchInput.value = this.activeFilters.search;
    }
  },

  getStockLabel: function (p) {
    return Number(p.stock) > 0 ? "In Stock" : "Out of Stock";
  },

  categoryLabel: function (cat) {
    return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : "Water Purifier";
  },

  formatPrice: function (p) {
    const priceNow = (p.discount_price !== null && p.discount_price !== undefined) ? p.discount_price : p.price;
    if (priceNow === null || priceNow === undefined || isNaN(Number(priceNow))) return "Enquire for Best Price";
    return "₹" + Number(priceNow).toLocaleString("en-IN");
  },

  /**
   * Dynamically build filter checkboxes from existing product data
   */
  populateFilterOptions: function () {
    const categories = new Set();
    const brands = new Set();
    const availabilities = new Set();

    this.products.forEach(p => {
      if (p.category) categories.add(p.category);
      if (p.brand) brands.add(p.brand);
      availabilities.add(this.getStockLabel(p));
    });

    this.renderCheckboxList("categoryFilterList", Array.from(categories), "category");
    this.renderCheckboxList("brandFilterList", Array.from(brands), "brand");
    this.renderCheckboxList("availabilityFilterList", Array.from(availabilities), "availability");
  },

  renderCheckboxList: function (containerId, items, filterType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `<span style="font-size: 0.8rem; color: #94A3B8;">None</span>`;
      return;
    }

    container.innerHTML = items.map(item => {
      const isChecked = this.activeFilters[filterType].includes(item) ? "checked" : "";
      const count = this.products.filter(p => p[filterType] === item).length;
      return `
        <label class="filter-checkbox-label">
          <input type="checkbox" value="${escapeHtml(item)}" data-filter-type="${filterType}" ${isChecked}>
          <span>${escapeHtml(item)}</span>
          <span class="filter-count">(${count})</span>
        </label>
      `;
    }).join("");
  },

  /**
   * Filter and sort execution
   */
  applyFiltersAndSort: function () {
    let result = [...this.products];

    // Search filter
    if (this.activeFilters.search) {
      const q = this.activeFilters.search.toLowerCase().trim();
      result = result.filter(p => {
        return (
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.slug && p.slug.toLowerCase().includes(q)) ||
          (p.short_desc && p.short_desc.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      });
    }

    // Category filter — accept both enum values and legacy friendly labels in URLs
    if (this.activeFilters.category.length > 0) {
      const catAliases = { "Solar Solutions": "solar", "Solar Inverters": "inverter", "Water Purifiers": "purifier" };
      const wanted = this.activeFilters.category.map(c => catAliases[c] || c);
      result = result.filter(p => wanted.includes(p.category));
    }

    // Brand filter
    if (this.activeFilters.brand.length > 0) {
      result = result.filter(p => this.activeFilters.brand.includes(p.brand));
    }

    // Availability filter
    if (this.activeFilters.availability.length > 0) {
      result = result.filter(p => this.activeFilters.availability.includes(this.getStockLabel(p)));
    }

    // Sort
    if (this.currentSort === "featured") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (this.currentSort === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (this.currentSort === "name-desc") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (this.currentSort === "newest") {
      result.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    }

    this.filteredProducts = result;
    this.renderProductsGrid();
    this.updateProductCount();

    // Update Mobile Filter Badge and Apply Button
    const activeFilterCount =
      this.activeFilters.category.length +
      this.activeFilters.brand.length +
      this.activeFilters.availability.length +
      (this.activeFilters.search ? 1 : 0);

    const mobileBadge = document.getElementById("mobileFilterBadge");
    if (mobileBadge) {
      if (activeFilterCount > 0) {
        mobileBadge.textContent = activeFilterCount;
        mobileBadge.style.display = "inline-flex";
      } else {
        mobileBadge.style.display = "none";
      }
    }

    const applyMobileBtn = document.getElementById("btnApplyMobileFilters");
    if (applyMobileBtn) {
      applyMobileBtn.innerHTML = `<i class="fas fa-check"></i> Show ${result.length} Product${result.length === 1 ? "" : "s"}`;
    }
  },

  /**
   * Render cards into catalogue grid
   */
  renderProductsGrid: function () {
    const grid = document.getElementById("catalogProductsGrid");
    if (!grid) return;

    if (this.filteredProducts.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-search"></i>
          <h3>No matching water purifiers found</h3>
          <p>Try resetting filters or adjusting your search keyword.</p>
          <button class="btn-card-action btn-view" onclick="ProductsModule.resetAllFilters()" style="margin-top: 1rem; padding: 0.6rem 1.5rem;">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.filteredProducts.map(p => {
      const mainImg = p.image_url || PRODUCT_PLACEHOLDER;
      const isOutOfStock = Number(p.stock) <= 0;
      const waLink = WhatsAppService.getProductEnquiryUrl(p);

      return `
        <div class="product-card" data-product-id="${escapeHtml(p.id)}">
          <div class="product-badge-wrap">
            ${p.featured ? `<span class="badge-featured">Featured</span>` : ""}
            <span class="badge-stock ${isOutOfStock ? 'out' : ''}">${escapeHtml(this.getStockLabel(p))}</span>
          </div>

          <div class="product-image-container">
            <a href="product-details.html?id=${encodeURIComponent(p.id)}">
              <img src="${escapeHtml(mainImg)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.src='${PRODUCT_PLACEHOLDER}'">
            </a>
          </div>

          <div class="product-card-body">
            <span class="product-category-tag">${escapeHtml(this.categoryLabel(p.category))}</span>
            <h3 class="product-title">
              <a href="product-details.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a>
            </h3>
            <p class="product-short-desc">${escapeHtml(p.short_desc || p.description || "")}</p>

            <div class="product-meta-specs">
              ${p.capacity ? `<span class="meta-chip"><i class="fas fa-tint"></i> ${escapeHtml(p.capacity)}</span>` : ""}
              ${p.family ? `<span class="meta-chip"><i class="fas fa-microchip"></i> ${escapeHtml(p.family)}</span>` : ""}
              <span class="meta-chip"><i class="fas fa-tag"></i> ${escapeHtml(this.formatPrice(p))}</span>
            </div>

            <div class="product-card-footer">
              <div class="product-actions-primary" style="display:flex; flex-direction:column; gap:8px; width:100%; margin-top:12px;">
                <a href="${waLink}" target="_blank" rel="noopener" class="btn-card-action btn-whatsapp-order" style="background:#25D366; color:#ffffff; font-weight:700; padding:10px 14px; border-radius:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:8px; text-decoration:none; box-shadow:0 4px 12px rgba(37,211,102,0.25);">
                  <i class="fab fa-whatsapp" style="font-size:16px;"></i> Order on WhatsApp
                </a>
                <a href="product-details.html?id=${encodeURIComponent(p.id)}" class="btn-card-action btn-view" style="background:#F1F5F9; color:#0F172A; font-weight:600; padding:8px 14px; border-radius:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; border:1px solid #CBD5E1;">
                  <i class="fas fa-info-circle"></i> View Specifications
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  updateProductCount: function () {
    const el = document.getElementById("catalogProductCount");
    if (el) {
      el.textContent = `Showing ${this.filteredProducts.length} of ${this.products.length} products`;
    }
  },

  resetAllFilters: function () {
    this.activeFilters = {
      search: "",
      category: [],
      brand: [],
      availability: []
    };
    const searchInput = document.getElementById("catalogSearchInput");
    if (searchInput) searchInput.value = "";
    document.querySelectorAll(".filter-checkbox-label input").forEach(cb => cb.checked = false);
    this.applyFiltersAndSort();
  },

  bindEvents: function () {
    // Search input with debounce
    const searchInput = document.getElementById("catalogSearchInput");
    if (searchInput) {
      let timeout;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.activeFilters.search = e.target.value;
          this.applyFiltersAndSort();
        }, 250);
      });
    }

    // Sort select
    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.applyFiltersAndSort();
      });
    }

    // Filter checkbox changes (delegation)
    document.addEventListener("change", (e) => {
      if (e.target.matches("[data-filter-type]")) {
        const type = e.target.getAttribute("data-filter-type");
        if (!this.activeFilters[type]) return;
        const val = e.target.value;
        if (e.target.checked) {
          if (!this.activeFilters[type].includes(val)) {
            this.activeFilters[type].push(val);
          }
        } else {
          this.activeFilters[type] = this.activeFilters[type].filter(v => v !== val);
        }
        this.applyFiltersAndSort();
      }
    });

    // Reset button
    const resetBtn = document.getElementById("btnResetFilters");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetAllFilters());
    }

    // Mobile filter drawer open/close handlers
    const openFilterBtn = document.getElementById("btnOpenMobileFilters");
    const closeFilterBtn = document.getElementById("btnCloseFilterDrawer");
    const filterBackdrop = document.getElementById("filterDrawerBackdrop");
    const applyMobileBtn = document.getElementById("btnApplyMobileFilters");
    const filterSidebar = document.getElementById("catalogFilterSidebar");

    const openFilterDrawer = () => {
      if (filterSidebar) filterSidebar.classList.add("open");
      if (filterBackdrop) filterBackdrop.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const closeFilterDrawer = () => {
      if (filterSidebar) filterSidebar.classList.remove("open");
      if (filterBackdrop) filterBackdrop.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (openFilterBtn) openFilterBtn.addEventListener("click", openFilterDrawer);
    if (closeFilterBtn) closeFilterBtn.addEventListener("click", closeFilterDrawer);
    if (filterBackdrop) filterBackdrop.addEventListener("click", closeFilterDrawer);
    if (applyMobileBtn) applyMobileBtn.addEventListener("click", closeFilterDrawer);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("catalogProductsGrid")) {
    ProductsModule.init();
  }
});

if (typeof window !== "undefined") {
  window.ProductsModule = ProductsModule;
}
