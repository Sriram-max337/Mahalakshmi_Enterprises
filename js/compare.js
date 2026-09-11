/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Product Comparison Matrix Module (Up to 4 products)
 */

const CompareModule = {
  compareList: [],

  init: function () {
    this.compareList = DB.getCompare();
    this.renderCompare();
    this.bindEvents();

    window.addEventListener("mahalaxmi_db_update", (e) => {
      if (e.detail.key === DB_KEYS.COMPARE) {
        this.compareList = DB.getCompare();
        this.renderCompare();
      }
    });
  },

  renderCompare: function () {
    const tableWrap = document.getElementById("compareTableWrap");
    const emptyNotice = document.getElementById("compareEmptyNotice");
    const swipeHint = document.getElementById("compareSwipeHint");

    if (!tableWrap) return;

    if (this.compareList.length === 0) {
      if (emptyNotice) emptyNotice.style.display = "block";
      if (swipeHint) swipeHint.style.display = "none";
      tableWrap.style.display = "none";
      if (countText) countText.textContent = "0 of 4 products selected";
      return;
    }

    if (emptyNotice) emptyNotice.style.display = "none";
    if (swipeHint) swipeHint.style.display = "";
    tableWrap.style.display = "block";
    if (countText) countText.textContent = `${this.compareList.length} of 4 products selected`;

    const products = this.compareList;

    // Build side-by-side matrix
    let html = `
      <table class="compare-table">
        <tbody>
          <!-- Row 1: Products Header -->
          <tr>
            <th>Product</th>
            ${products.map(p => `
              <td class="compare-product-col">
                <div class="compare-img-box">
                  <img src="${p.image || 'assets/products/ro-pure-copper.svg'}" alt="${p.name}">
                </div>
                <h4 style="font-size: 1rem; color: var(--primary); margin-bottom: 0.35rem;">${p.name}</h4>
                <div style="font-size: 0.8rem; color: #64748B; margin-bottom: 0.75rem;">${p.model || ''}</div>
                <button class="btn-remove-compare" onclick="CompareModule.removeItem('${p.id}')">
                  <i class="fas fa-times"></i> Remove
                </button>
              </td>
            `).join("")}
          </tr>

          <!-- Row 2: Brand -->
          <tr>
            <th>Brand</th>
            ${products.map(p => `<td><strong>${p.brand || 'Dhanalakshmi Pureit'}</strong></td>`).join("")}
          </tr>

          <!-- Row 3: Category -->
          <tr>
            <th>Category</th>
            ${products.map(p => `<td>${p.category || 'Water Purifier'}</td>`).join("")}
          </tr>

          <!-- Row 4: Technology -->
          <tr>
            <th>Purification Technology</th>
            ${products.map(p => `<td><span class="meta-chip"><i class="fas fa-shield-alt"></i> ${p.purificationTechnology || 'N/A'}</span></td>`).join("")}
          </tr>

          <!-- Row 5: Capacity -->
          <tr>
            <th>Storage / Flow Capacity</th>
            ${products.map(p => `<td><strong>${p.capacity || 'Standard Capacity'}</strong></td>`).join("")}
          </tr>

          <!-- Row 6: Suitable Water Source -->
          <tr>
            <th>Suitable For</th>
            ${products.map(p => `<td>${p.suitableFor || 'Borewell & Municipal Water'}</td>`).join("")}
          </tr>

          <!-- Row 7: Key Features -->
          <tr>
            <th>Key Features</th>
            ${products.map(p => `
              <td>
                <ul style="padding-left: 1rem; font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.3rem;">
                  ${(p.features && p.features.length > 0) ? p.features.map(f => `<li>${f}</li>`).join("") : "<li>Advanced Multi-stage purification</li>"}
                </ul>
              </td>
            `).join("")}
          </tr>

          <!-- Row 8: Warranty -->
          <tr>
            <th>Warranty</th>
            ${products.map(p => `<td>${p.warranty || '1 Year Comprehensive Warranty'}</td>`).join("")}
          </tr>

          <!-- Row 9: Installation -->
          <tr>
            <th>Installation</th>
            ${products.map(p => `<td>${p.installation || 'Doorstep Installation Support'}</td>`).join("")}
          </tr>

          <!-- Row 10: Service Support -->
          <tr>
            <th>Service Support</th>
            ${products.map(p => `<td>${p.serviceInfo || 'Mahalaxmi Enterprises Service Support'}</td>`).join("")}
          </tr>

          <!-- Row 11: Action Buttons -->
          <tr>
            <th>Enquire / Order</th>
            ${products.map(p => `
              <td>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <button class="btn-card-action btn-cart-add" onclick="CompareModule.addToCart('${p.id}')">
                    <i class="fas fa-cart-plus"></i> Add to Enquiry Cart
                  </button>
                  <a href="${WhatsAppService.getProductEnquiryUrl(p)}" target="_blank" rel="noopener" class="btn-card-action btn-whatsapp-enq">
                    <i class="fab fa-whatsapp"></i> WhatsApp Enquiry
                  </a>
                </div>
              </td>
            `).join("")}
          </tr>
        </tbody>
      </table>
    `;

    tableWrap.innerHTML = html;
  },

  removeItem: function (productId) {
    DB.removeFromCompare(productId);
    App.toast("Removed from comparison list", "info");
  },

  clearAll: function () {
    if (confirm("Clear all products from comparison?")) {
      DB.clearCompare();
      App.toast("Comparison cleared", "info");
    }
  },

  addToCart: function (productId) {
    const p = this.compareList.find(item => item.id === productId);
    if (p) {
      DB.addToCart(p, 1);
      App.toast(`"${p.name}" added to Enquiry Cart!`, "success");
    }
  },

  bindEvents: function () {
    const clearBtn = document.getElementById("btnClearCompare");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearAll());
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("compareTableWrap")) {
    CompareModule.init();
  }
});

if (typeof window !== "undefined") {
  window.CompareModule = CompareModule;
}
