/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Product Details Module: Supabase Data Source, Gallery with Zoom,
 * Specs Rendering & Enquiry Actions
 */

const PRODUCT_PLACEHOLDER = "assets/products/ro-pure-copper.svg";

const ProductDetailsModule = {
  product: null,
  activeImageIndex: 0,

  init: async function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
      this.renderNotFound("No product selected. Please browse our catalogue.");
      return;
    }

    // Supabase fetch: single row by UUID
    const sb = getSupabaseClient();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();

    if (error) {
      console.error("Supabase product fetch failed:", error.message);
      this.renderNotFound("Something went wrong while loading this product. Please try again.");
      return;
    }

    this.product = data;

    if (!this.product) {
      this.renderNotFound("Product not found or has been removed.");
      return;
    }

    this.renderProductDetails();
    this.renderSpecificationsTable();
    await this.renderRelatedProducts();
    this.renderMobileStickyBar();
    this.bindGalleryEvents();
    this.bindActionButtons();
  },

  renderNotFound: function (msg) {
    const container = document.getElementById("productDetailsContainer");
    if (container) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 5rem 1rem;">
          <i class="fas fa-exclamation-circle" style="color: #EF4444;"></i>
          <h2>Product Not Found</h2>
          <p>${escapeHtml(msg)}</p>
          <a href="products.html" class="btn-hero-primary" style="display: inline-block; margin-top: 1.5rem;">
            Back to Products Catalogue
          </a>
        </div>
      `;
    }
  },

  renderProductDetails: function () {
    const p = this.product;
    document.title = `${p.name} - Mahalaxmi Enterprises | Dhanalakshmi Pureit`;

    // Breadcrumb
    const breadcrumbCurrent = document.getElementById("detailBreadcrumbCurrent");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = p.name;

    // Gallery: single image_url column today (4-slot UI retained; slots
    // repeat the same image until a multi-image gallery ships)
    const images = [p.image_url || PRODUCT_PLACEHOLDER];
    while (images.length < 4) {
      images.push(images[0]); // Pad up to 4 thumbnails if fewer provided
    }

    const mainImgWrap = document.getElementById("mainImageWrap");
    if (mainImgWrap) {
      mainImgWrap.innerHTML = `
        <img id="mainProductImage" src="${escapeHtml(images[0])}" alt="${escapeHtml(p.name)}" onerror="this.src='${PRODUCT_PLACEHOLDER}'">
      `;
    }

    const thumbGallery = document.getElementById("thumbnailGallery");
    if (thumbGallery) {
      thumbGallery.innerHTML = images.slice(0, 4).map((img, idx) => `
        <div class="thumbnail-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)} Thumbnail ${idx + 1}" onerror="this.src='${PRODUCT_PLACEHOLDER}'">
        </div>
      `).join("");
    }

    // Right Side Info Panel
    const infoPanel = document.getElementById("productInfoPanel");
    if (infoPanel) {
      const waUrl = WhatsAppService.getProductEnquiryUrl(p);
      const cleanPhone = WhatsAppService.getCleanPhone();
      const priceNow = (p.discount_price !== null && p.discount_price !== undefined) ? p.discount_price : p.price;
      const priceHtml = (priceNow !== null && priceNow !== undefined && !isNaN(Number(priceNow)))
        ? `<div class="detail-price" style="font-size: 1.6rem; font-weight: 800; color: var(--primary); margin-bottom: 1rem;">&#8377;${Number(priceNow).toLocaleString("en-IN")}${p.discount_price !== null && p.discount_price !== undefined && p.price ? ` <span style="font-size: 0.95rem; color: #94A3B8; text-decoration: line-through; font-weight: 500;">&#8377;${Number(p.price).toLocaleString("en-IN")}</span>` : ""}</div>`
        : `<p class="detail-description" style="font-weight: 700; color: var(--primary); margin-bottom: 1rem;">Enquire for Best Price</p>`;

      const stockLabel = Number(p.stock) > 0 ? "In Stock" : "Out of Stock";
      const stockPill = `<span class="badge-stock ${Number(p.stock) > 0 ? '' : 'out'}" style="display:inline-flex; margin-bottom: 0.75rem;">${escapeHtml(stockLabel)}</span>`;

      infoPanel.innerHTML = `
        <span class="detail-brand-badge">${escapeHtml(p.brand || 'Dhanalakshmi Pureit')} &bull; ${escapeHtml(p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Water Purifier')}</span>
        <h1>${escapeHtml(p.name)}</h1>
        ${p.family ? `<p style="font-size: 0.9rem; color: #64748B; margin-bottom: 0.75rem;">Family: <strong>${escapeHtml(p.family)}</strong></p>` : ''}
        ${stockPill}
        ${priceHtml}

        <p class="detail-description">${escapeHtml(p.description || 'Premium water purification engineered for maximum safety and purity.')}</p>

        <div class="detail-highlight-boxes">
          ${p.capacity ? `
            <div class="highlight-box">
              <div class="highlight-label">Capacity</div>
              <div class="highlight-value"><i class="fas fa-tint" style="color: var(--secondary); margin-right: 4px;"></i> ${escapeHtml(p.capacity)}</div>
            </div>
          ` : ''}
        </div>

        ${p.features && p.features.length > 0 ? `
          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1.05rem; margin-bottom: 0.6rem; color: var(--primary);">Key Features:</h4>
            <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.92rem; color: #334155;">
              ${p.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="detail-actions">
          <div class="detail-btn-row">
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn-detail-whatsapp" style="flex: 1; font-size: 1rem; padding: 0.9rem; justify-content: center; background: #25D366; color: #FFFFFF; box-shadow: 0 4px 14px rgba(37,211,102,0.3);">
              <i class="fab fa-whatsapp"></i> Order on WhatsApp
            </a>
            <a href="tel:+${escapeHtml(cleanPhone)}" class="btn-detail-call" style="padding: 0.9rem 1.25rem;">
              <i class="fas fa-phone-alt"></i> Call Helpline
            </a>
          </div>
        </div>
      `;
    }
  },

  /**
   * Mobile-Only Sticky Bottom Action Bar for 1-tap conversion
   */
  renderMobileStickyBar: function () {
    if (document.querySelector(".mobile-sticky-action-bar")) return;

    const p = this.product;
    const waUrl = WhatsAppService.getProductEnquiryUrl(p);

    const bar = document.createElement("div");
    bar.className = "mobile-sticky-action-bar";
    bar.innerHTML = `
      <a href="${waUrl}" target="_blank" rel="noopener" class="btn-card-action btn-whatsapp-enq" style="flex: 1; padding: 0.85rem 1rem; font-size: 0.95rem; font-weight: 700; background: #25D366; color: #FFFFFF; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <i class="fab fa-whatsapp"></i> Order on WhatsApp
      </a>
      <button id="btnMobileStickyCart" class="btn-card-action btn-view" style="padding: 0.85rem 1rem; font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <i class="fas fa-shopping-cart"></i> Add to Enquiry Cart
      </button>
    `;

    document.body.appendChild(bar);

    document.getElementById("btnMobileStickyCart")?.addEventListener("click", () => {
      DB.addToCart(this.product, 1);
      App.toast(`"${this.product.name}" added to Enquiry Cart!`, "success");
    });
  },

  /**
   * Spec chips derived from schema columns actually present.
   */
  renderSpecificationsTable: function () {
    const tableBody = document.getElementById("specsTableBody");
    if (!tableBody) return;

    const p = this.product;
    const rows = [];
    if (p.brand) rows.push(["Brand", p.brand]);
    if (p.family) rows.push(["Product Family", p.family]);
    if (p.capacity) rows.push(["Capacity", p.capacity]);
    if (p.category) rows.push(["Category", p.category.charAt(0).toUpperCase() + p.category.slice(1)]);

    if (rows.length === 0) {
      document.getElementById("specsTableSection")?.remove();
      return;
    }

    tableBody.innerHTML = rows.map(([key, val]) => `
      <tr>
        <td>${escapeHtml(key)}</td>
        <td>${escapeHtml(val)}</td>
      </tr>
    `).join("");
  },

  renderRelatedProducts: async function () {
    const container = document.getElementById("relatedProductsGrid");
    if (!container) return;

    const allProducts = await fetchAllProducts();
    const related = allProducts
      .filter(p => p.id !== this.product.id && p.category === this.product.category)
      .slice(0, 3);

    let items = related;
    if (items.length === 0) {
      items = allProducts.filter(p => p.id !== this.product.id).slice(0, 3);
    }
    if (items.length === 0) {
      document.getElementById("relatedSection")?.remove();
      return;
    }
    this.renderProductCardsInto(container, items);
  },

  renderProductCardsInto: function (container, items) {
    container.innerHTML = items.map(p => {
      const img = p.image_url || PRODUCT_PLACEHOLDER;
      return `
        <div class="product-card">
          <div class="product-image-container">
            <a href="product-details.html?id=${encodeURIComponent(p.id)}">
              <img src="${escapeHtml(img)}" alt="${escapeHtml(p.name)}" onerror="this.src='${PRODUCT_PLACEHOLDER}'">
            </a>
          </div>
          <div class="product-card-body">
            <span class="product-category-tag">${escapeHtml(p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Water Purifier')}</span>
            <h3 class="product-title">
              <a href="product-details.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a>
            </h3>
            <p class="product-short-desc">${escapeHtml(p.short_desc || "")}</p>
            <div class="product-card-footer">
              <div style="display:flex; flex-direction:column; gap:6px; width:100%; margin-top:10px;">
                <a href="${WhatsAppService.getProductEnquiryUrl(p)}" target="_blank" rel="noopener" style="background:#25D366; color:#ffffff; font-weight:700; padding:8px 12px; border-radius:6px; text-align:center; display:flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; font-size:13px;">
                  <i class="fab fa-whatsapp"></i> Order on WhatsApp
                </a>
                <a href="product-details.html?id=${encodeURIComponent(p.id)}" style="background:#F1F5F9; color:#0F172A; font-weight:600; padding:6px 12px; border-radius:6px; text-align:center; display:flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; font-size:12px; border:1px solid #CBD5E1;">
                  <i class="fas fa-eye"></i> View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  bindGalleryEvents: function () {
    const mainWrap = document.getElementById("mainImageWrap");
    const mainImg = document.getElementById("mainProductImage");
    const thumbs = document.querySelectorAll(".thumbnail-item");

    const images = [this.product.image_url || PRODUCT_PLACEHOLDER];

    thumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
        thumbs.forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        const idx = Number(thumb.getAttribute("data-index"));
        if (images[idx] && mainImg) {
          mainImg.src = images[idx];
        }
      });
    });

    // Image Zoom Lens Effect on desktop hover, touch friendly on mobile
    if (mainWrap && mainImg) {
      mainWrap.addEventListener("mousemove", (e) => {
        if (window.innerWidth < 768) return; // Don't trigger hover scale on touch
        const rect = mainWrap.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mainImg.style.transformOrigin = `${x}% ${y}%`;
        mainImg.style.transform = "scale(1.8)";
      });

      mainWrap.addEventListener("mouseleave", () => {
        mainImg.style.transformOrigin = "center center";
        mainImg.style.transform = "scale(1)";
      });
    }
  },

  bindActionButtons: function () {
    const cartBtn = document.getElementById("btnDetailAddToCart");
    if (cartBtn) {
      cartBtn.addEventListener("click", () => {
        DB.addToCart(this.product, 1);
        App.toast(`"${this.product.name}" added to Enquiry Cart!`, "success");
      });
    }

    const compareBtn = document.getElementById("btnDetailCompare");
    if (compareBtn) {
      compareBtn.addEventListener("click", () => {
        const res = DB.addToCompare(this.product);
        if (res.success) {
          App.toast(res.message, "success");
        } else {
          App.toast(res.message, "error");
        }
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("productDetailsContainer")) {
    ProductDetailsModule.init();
  }
});

if (typeof window !== "undefined") {
  window.ProductDetailsModule = ProductDetailsModule;
}
