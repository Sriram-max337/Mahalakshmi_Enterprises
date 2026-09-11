/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Admin Product Management Module (Supabase)
 *
 * Products live in the Supabase `products` table:
 *   id, slug (unique), category (enum: purifier/solar/inverter), brand, name,
 *   short_desc, description, price, discount_price, family, capacity,
 *   features (text[]), stock, featured (bool), image_url, created_at, updated_at
 *
 * Image files are uploaded to the public `product-images` Storage bucket.
 * Categories management below still uses LocalStorage (out of scope for now).
 */

const PRODUCT_PLACEHOLDER = "assets/products/ro-pure-copper.svg";
const PRODUCT_CATEGORIES = ["purifier", "solar", "inverter"];

const AdminProducts = {
  products: [],
  currentEditId: null,
  pendingImageFile: null,

  init: function () {
    this.loadAndRenderProducts();
    this.renderCategoriesTable();
    this.bindProductEvents();
    this.bindImageUploader();
    this.bindCategoryEvents();
  },

  /**
   * Fetch products from Supabase and render the management table.
   */
  loadAndRenderProducts: async function () {
    if (!isSupabaseReady()) {
      App.toast("Supabase is not configured. Edit js/supabase-config.js.", "error");
      return;
    }
    this.products = await fetchAllProducts();
    this.renderProductsTable();
  },

  /**
   * Render Product Management Table (uses this.products cache)
   */
  renderProductsTable: function () {
    const tableBody = document.getElementById("adminProductsTableBody");
    if (!tableBody) return;

    const searchVal = document.getElementById("adminProductSearch")?.value.toLowerCase().trim() || "";
    const catVal = document.getElementById("adminProductCatFilter")?.value || "";

    const filtered = this.products.filter(p => {
      const matchesSearch = !searchVal || (
        (p.name && p.name.toLowerCase().includes(searchVal)) ||
        (p.brand && p.brand.toLowerCase().includes(searchVal)) ||
        (p.slug && p.slug.toLowerCase().includes(searchVal))
      );
      const matchesCat = !catVal || p.category === catVal;
      return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 2.5rem;">No products found matching criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(p => {
      const img = p.image_url || PRODUCT_PLACEHOLDER;
      const inStock = Number(p.stock) > 0;
      const catLabel = p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "N/A";

      return `
        <tr>
          <td><img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" class="tbl-img" onerror="this.src='${PRODUCT_PLACEHOLDER}'"></td>
          <td>
            <strong>${escapeHtml(p.name)}</strong>
            <div style="font-size: 0.78rem; color: #64748B;">/${escapeHtml(p.slug || "")}</div>
          </td>
          <td>${escapeHtml(p.brand || "-")}</td>
          <td><span class="meta-chip">${escapeHtml(catLabel)}</span></td>
          <td>
            <button class="status-pill ${inStock ? 'status-completed' : 'status-cancelled'}" style="cursor: pointer; border: none;" onclick="AdminProducts.toggleStock('${p.id}')">
              ${inStock ? `In Stock (${p.stock})` : "Out of Stock"}
            </button>
          </td>
          <td>
            <button class="status-pill ${p.featured ? 'status-contacted' : 'status-inactive'}" style="cursor: pointer; border: none;" onclick="AdminProducts.toggleFeatured('${p.id}')">
              ${p.featured ? '<i class="fas fa-star"></i> Featured' : 'Standard'}
            </button>
          </td>
          <td>
            <div class="tbl-actions">
              <a href="product-details.html?id=${encodeURIComponent(p.id)}" target="_blank" class="btn-tbl view" title="Preview on Website"><i class="fas fa-external-link-alt"></i></a>
              <button class="btn-tbl edit" onclick="AdminProducts.openEditModal('${p.id}')" title="Edit Product"><i class="fas fa-edit"></i></button>
              <button class="btn-tbl view" onclick="AdminProducts.duplicateProduct('${p.id}')" title="Duplicate Product"><i class="fas fa-copy"></i></button>
              <button class="btn-tbl delete" onclick="AdminProducts.deleteProduct('${p.id}')" title="Delete Product"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  openAddModal: function () {
    this.currentEditId = null;
    this.pendingImageFile = null;
    document.getElementById("productModalTitle").textContent = "Add New Product";
    document.getElementById("productForm").reset();
    document.getElementById("prodStock").value = "10";
    this.renderImagePreview(PRODUCT_PLACEHOLDER, "");
    document.getElementById("productModalBackdrop").classList.add("show");
  },

  openEditModal: function (productId) {
    const p = this.products.find(x => String(x.id) === String(productId));
    if (!p) return;

    this.currentEditId = p.id;
    this.pendingImageFile = null;
    document.getElementById("productModalTitle").textContent = "Edit Product: " + (p.name || "");

    document.getElementById("prodName").value = p.name || "";
    document.getElementById("prodSlug").value = p.slug || "";
    document.getElementById("prodBrand").value = p.brand || "";
    document.getElementById("prodCategory").value = p.category || "purifier";
    document.getElementById("prodFamily").value = p.family || "";
    document.getElementById("prodCapacity").value = p.capacity || "";
    document.getElementById("prodPrice").value = (p.price === null || p.price === undefined) ? "" : p.price;
    document.getElementById("prodDiscountPrice").value = (p.discount_price === null || p.discount_price === undefined) ? "" : p.discount_price;
    document.getElementById("prodShortDesc").value = p.short_desc || "";
    document.getElementById("prodDescription").value = p.description || "";
    document.getElementById("prodFeatures").value = (p.features && Array.isArray(p.features)) ? p.features.join("\n") : "";
    document.getElementById("prodStock").value = (p.stock === null || p.stock === undefined) ? "0" : p.stock;
    document.getElementById("prodFeatured").checked = !!p.featured;

    this.renderImagePreview(p.image_url || PRODUCT_PLACEHOLDER, p.image_url || "");

    document.getElementById("productModalBackdrop").classList.add("show");
  },

  renderImagePreview: function (src, urlInputValue) {
    const previewImg = document.getElementById("imgPreview0");
    const urlInput = document.getElementById("imgUrl0");
    if (previewImg) previewImg.src = src || PRODUCT_PLACEHOLDER;
    if (urlInput) urlInput.value = urlInputValue || "";
  },

  bindImageUploader: function () {
    const fileInput = document.getElementById("imgFile0");
    const urlInput = document.getElementById("imgUrl0");

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        this.pendingImageFile = file;
        // Local preview only — the real upload happens in saveProduct()
        const reader = new FileReader();
        reader.onload = (loadEvent) => this.renderImagePreview(loadEvent.target.result, "[Uploaded file — stored on save]");
        reader.readAsDataURL(file);
      });
    }

    if (urlInput) {
      urlInput.addEventListener("change", (e) => {
        const val = e.target.value.trim();
        if (val && !val.startsWith("[")) {
          // Pasting a URL overrides any pending file upload
          this.pendingImageFile = null;
          this.renderImagePreview(val, val);
        }
      });
    }
  },

  /**
   * Upload the pending image file to the product-images bucket and return
   * its public URL. Returns null when there is nothing to upload.
   */
  uploadPendingImage: async function (slug) {
    if (!this.pendingImageFile) return null;

    const sb = getSupabaseClient();
    const extMatch = this.pendingImageFile.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
    const path = `products/${(slug || "product").replace(/[^a-z0-9-]/gi, "-")}-${Date.now()}.${ext}`;

    const { error: uploadError } = await sb.storage
      .from("product-images")
      .upload(path, this.pendingImageFile, { upsert: false });

    if (uploadError) {
      throw new Error("Image upload failed: " + uploadError.message);
    }

    const { data } = sb.storage.from("product-images").getPublicUrl(path);
    if (!data || !data.publicUrl) {
      throw new Error("Could not resolve public URL for the uploaded image.");
    }
    return data.publicUrl;
  },

  saveProduct: async function () {
    const name = document.getElementById("prodName").value.trim();
    const slug = document.getElementById("prodSlug").value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    if (!name) {
      App.toast("Product name is required", "error");
      return;
    }
    if (!slug) {
      App.toast("URL slug is required (e.g. pureit-copper-plus)", "error");
      return;
    }

    const saveBtn = document.getElementById("btnSaveProduct");
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';

    try {
      // 1. Upload image (if a new file was picked)
      let uploadedUrl = null;
      try {
        uploadedUrl = await this.uploadPendingImage(slug);
      } catch (uploadErr) {
        App.toast(uploadErr.message, "error");
        return;
      }

      // 2. Resolve final image_url:
      //    new upload > manually entered URL > existing value (edit) > null (placeholder shown)
      const urlInputVal = document.getElementById("imgUrl0").value.trim();
      let image_url = uploadedUrl;
      if (!image_url && urlInputVal && !urlInputVal.startsWith("[")) {
        image_url = urlInputVal;
      }
      if (!image_url && this.currentEditId) {
        const existing = this.products.find(x => String(x.id) === String(this.currentEditId));
        image_url = existing ? existing.image_url : null;
      }

      // 3. Build payload matching the products table schema
      const featuresRaw = document.getElementById("prodFeatures").value;
      const features = featuresRaw.split("\n").map(f => f.trim()).filter(f => f.length > 0);

      const priceRaw = document.getElementById("prodPrice").value.trim();
      const discountRaw = document.getElementById("prodDiscountPrice").value.trim();
      const stockRaw = parseInt(document.getElementById("prodStock").value, 10);

      const payload = {
        slug,
        name,
        brand: document.getElementById("prodBrand").value.trim() || null,
        category: document.getElementById("prodCategory").value || "purifier",
        family: document.getElementById("prodFamily").value.trim() || null,
        capacity: document.getElementById("prodCapacity").value.trim() || null,
        short_desc: document.getElementById("prodShortDesc").value.trim() || null,
        description: document.getElementById("prodDescription").value.trim() || null,
        price: (priceRaw !== "" && !isNaN(Number(priceRaw))) ? Number(priceRaw) : null,
        discount_price: (discountRaw !== "" && !isNaN(Number(discountRaw))) ? Number(discountRaw) : null,
        features,
        stock: isNaN(stockRaw) ? 0 : stockRaw,
        featured: document.getElementById("prodFeatured").checked,
        image_url: image_url || null
      };

      const sb = getSupabaseClient();
      let error = null;

      if (this.currentEditId) {
        ({ error } = await sb.from("products").update(payload).eq("id", this.currentEditId));
      } else {
        ({ error } = await sb.from("products").insert(payload));
      }

      if (error) {
        console.error("Supabase product save failed:", error.message);
        App.toast("Save failed: " + error.message, "error");
        return;
      }

      App.toast(`${this.currentEditId ? "Updated" : "Added"} product "${name}"`, "success");
      document.getElementById("productModalBackdrop").classList.remove("show");
      this.pendingImageFile = null;
      await this.loadAndRenderProducts();
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
    }
  },

  deleteProduct: async function (id) {
    const p = this.products.find(x => String(x.id) === String(id));
    if (!confirm(`Are you sure you want to delete "${p?.name || 'this product'}"? This action will immediately remove it from customer pages.`)) {
      return;
    }

    const sb = getSupabaseClient();
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) {
      console.error("Supabase product delete failed:", error.message);
      App.toast("Delete failed: " + error.message, "error");
      return;
    }

    App.toast("Product deleted successfully", "info");
    await this.loadAndRenderProducts();
  },

  duplicateProduct: async function (id) {
    const p = this.products.find(x => String(x.id) === String(id));
    if (!p) return;

    const sb = getSupabaseClient();
    const copy = { ...p };
    delete copy.id;
    delete copy.created_at;
    delete copy.updated_at;
    copy.name = `${p.name} (Copy)`;
    copy.slug = `${p.slug || "product"}-copy-${Date.now().toString(36)}`;

    const { error } = await sb.from("products").insert(copy);
    if (error) {
      console.error("Supabase product duplicate failed:", error.message);
      App.toast("Duplicate failed: " + error.message, "error");
      return;
    }

    App.toast("Product duplicated!", "success");
    await this.loadAndRenderProducts();
  },

  toggleFeatured: async function (id) {
    const p = this.products.find(x => String(x.id) === String(id));
    if (!p) return;

    const sb = getSupabaseClient();
    const { error } = await sb.from("products").update({ featured: !p.featured }).eq("id", id);
    if (error) {
      console.error("Supabase update failed:", error.message);
      App.toast("Update failed: " + error.message, "error");
      return;
    }
    App.toast(`Featured state toggled for ${p.name}`, "info");
    await this.loadAndRenderProducts();
  },

  toggleStock: async function (id) {
    const p = this.products.find(x => String(x.id) === String(id));
    if (!p) return;

    const inStock = Number(p.stock) > 0;
    const newStock = inStock ? 0 : 10;

    const sb = getSupabaseClient();
    const { error } = await sb.from("products").update({ stock: newStock }).eq("id", id);
    if (error) {
      console.error("Supabase update failed:", error.message);
      App.toast("Update failed: " + error.message, "error");
      return;
    }
    App.toast(`Availability set to ${newStock > 0 ? "In Stock" : "Out of Stock"}`, "info");
    await this.loadAndRenderProducts();
  },

  bindProductEvents: function () {
    document.getElementById("btnOpenAddProduct")?.addEventListener("click", () => this.openAddModal());
    document.getElementById("btnCloseProductModal")?.addEventListener("click", () => {
      document.getElementById("productModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnCancelProduct")?.addEventListener("click", () => {
      document.getElementById("productModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnSaveProduct")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.saveProduct();
    });

    document.getElementById("adminProductSearch")?.addEventListener("input", () => this.renderProductsTable());
    document.getElementById("adminProductCatFilter")?.addEventListener("change", () => this.renderProductsTable());
  },

  /**
   * CATEGORY MANAGEMENT (LocalStorage — unchanged, out of Supabase scope)
   */
  renderCategoriesTable: function () {
    const tableBody = document.getElementById("adminCategoriesTableBody");
    if (!tableBody) return;

    const categories = DB.getCategories();

    tableBody.innerHTML = categories.map(cat => {
      return `
        <tr>
          <td><strong>${escapeHtml(cat.name)}</strong></td>
          <td><code>${escapeHtml(cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'))}</code></td>
          <td>${escapeHtml(cat.description || 'N/A')}</td>
          <td>
            <button class="status-pill ${cat.status === 'active' ? 'status-completed' : 'status-inactive'}" style="cursor: pointer; border: none;" onclick="AdminProducts.toggleCategoryStatus('${cat.id}')">
              ${escapeHtml(cat.status || 'active')}
            </button>
          </td>
          <td>
            <div class="tbl-actions">
              <button class="btn-tbl delete" onclick="AdminProducts.deleteCategory('${cat.id}')" title="Delete Category"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  bindCategoryEvents: function () {
    const form = document.getElementById("addCategoryForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("newCatName").value.trim();
        const desc = document.getElementById("newCatDesc").value.trim();

        if (!name) {
          App.toast("Category name is required", "error");
          return;
        }

        DB.insert(DB_KEYS.CATEGORIES, {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: desc,
          status: "active"
        });

        App.toast(`Category "${name}" added!`, "success");
        form.reset();
        this.renderCategoriesTable();
      });
    }
  },

  toggleCategoryStatus: function (id) {
    const c = DB.getById(DB_KEYS.CATEGORIES, id);
    if (c) {
      const nextStatus = (c.status === "active") ? "inactive" : "active";
      DB.update(DB_KEYS.CATEGORIES, id, { status: nextStatus });
      this.renderCategoriesTable();
    }
  },

  deleteCategory: function (id) {
    const c = DB.getById(DB_KEYS.CATEGORIES, id);
    if (confirm(`Delete category "${c?.name}"?`)) {
      DB.delete(DB_KEYS.CATEGORIES, id);
      App.toast("Category deleted", "info");
      this.renderCategoriesTable();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("admin-body")) {
    AdminProducts.init();
  }
});

if (typeof window !== "undefined") {
  window.AdminProducts = AdminProducts;
}
