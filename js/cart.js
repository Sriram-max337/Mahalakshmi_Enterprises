/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Enquiry Cart Module (Quotation Request System)
 */

const CartModule = {
  cart: [],

  init: function () {
    this.cart = DB.getCart();
    this.renderCart();
    this.bindEvents();

    window.addEventListener("mahalaxmi_db_update", (e) => {
      if (e.detail.key === DB_KEYS.CART) {
        this.cart = DB.getCart();
        this.renderCart();
      }
    });
  },

  renderCart: function () {
    const container = document.getElementById("cartItemsContainer");
    const emptyNotice = document.getElementById("cartEmptyNotice");
    const cartSummaryWrap = document.getElementById("cartSummaryWrap");

    if (!container) return;

    if (this.cart.length === 0) {
      if (emptyNotice) emptyNotice.style.display = "block";
      if (cartSummaryWrap) cartSummaryWrap.style.display = "none";
      container.innerHTML = "";
      return;
    }

    if (emptyNotice) emptyNotice.style.display = "none";
    if (cartSummaryWrap) cartSummaryWrap.style.display = "block";

    container.innerHTML = this.cart.map(item => `
      <div class="cart-item-row" data-cart-id="${item.id}">
        <div class="cart-item-img">
          <img src="${item.image || 'assets/products/ro-pure-copper.svg'}" alt="${item.name}">
        </div>

        <div class="cart-item-info">
          <h4 class="cart-item-name">
            <a href="product-details.html?id=${encodeURIComponent(item.id)}">${item.name}</a>
          </h4>
          <span class="cart-item-brand">${item.brand || 'Dhanalakshmi Pureit'} ${item.capacity ? `&bull; ${item.capacity}` : ''}</span>
        </div>

        <div class="cart-qty-ctrl">
          <button class="cart-qty-btn" onclick="CartModule.changeQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
          <span class="cart-qty-val">${item.quantity || 1}</span>
          <button class="cart-qty-btn" onclick="CartModule.changeQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>

        <button class="btn-remove-item" onclick="CartModule.removeItem('${item.id}')" title="Remove item">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join("");

    // Update item total count
    const totalCount = this.cart.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
    const countDisplay = document.getElementById("cartItemsCountText");
    if (countDisplay) {
      countDisplay.textContent = `${totalCount} item(s) in quotation list`;
    }
  },

  changeQty: function (productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      const newQty = (item.quantity || 1) + delta;
      DB.updateCartQty(productId, newQty);
    }
  },

  removeItem: function (productId) {
    DB.removeFromCart(productId);
    App.toast("Item removed from enquiry cart", "info");
  },

  clearAll: function () {
    if (confirm("Are you sure you want to clear your enquiry cart?")) {
      DB.clearCart();
      App.toast("Enquiry cart cleared", "info");
    }
  },

  getFormData: function () {
    const name = document.getElementById("enquiryName")?.value.trim();
    const phone = document.getElementById("enquiryPhone")?.value.trim();
    const email = document.getElementById("enquiryEmail")?.value.trim();
    const location = document.getElementById("enquiryLocation")?.value.trim();
    const message = document.getElementById("enquiryMessage")?.value.trim();

    if (!name || !phone) {
      App.toast("Please enter your name and phone number.", "error");
      return null;
    }

    return { name, phone, email, location, message };
  },

  /**
   * Submit enquiry directly to LocalStorage database
   */
  submitDirectEnquiry: function () {
    const customer = this.getFormData();
    if (!customer) return;

    if (this.cart.length === 0) {
      App.toast("Your enquiry cart is empty. Please add products first.", "error");
      return;
    }

    const itemsSummary = this.cart.map(i => `${i.name} (Qty: ${i.quantity || 1})`).join(", ");

    const enquiryRecord = {
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email || "Not provided",
      location: customer.location || "Not provided",
      productName: itemsSummary,
      cartSnapshot: [...this.cart],
      message: customer.message || "Quotation requested from Enquiry Cart",
      date: new Date().toLocaleString(),
      status: "New"
    };

    DB.insert(DB_KEYS.ENQUIRIES, enquiryRecord);
    DB.clearCart();

    // Show success feedback
    const modal = document.getElementById("cartSuccessModal");
    if (modal) {
      modal.classList.add("show");
    } else {
      App.toast("Enquiry sent successfully! Mahalaxmi Enterprises will contact you shortly.", "success");
    }
  },

  /**
   * Automatically generate WhatsApp message containing selected products
   */
  sendWhatsAppEnquiry: function () {
    const customer = this.getFormData();
    if (!customer) return;

    if (this.cart.length === 0) {
      App.toast("Your enquiry cart is empty.", "error");
      return;
    }

    // Also record it into DB enquiries
    const itemsSummary = this.cart.map(i => `${i.name} (Qty: ${i.quantity || 1})`).join(", ");
    DB.insert(DB_KEYS.ENQUIRIES, {
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email || "Not provided",
      location: customer.location || "Not provided",
      productName: itemsSummary,
      cartSnapshot: [...this.cart],
      message: (customer.message || "") + " (Sent via WhatsApp)",
      date: new Date().toLocaleString(),
      status: "New"
    });

    const waUrl = WhatsAppService.getCartEnquiryUrl(this.cart, customer);
    window.open(waUrl, "_blank");

    App.toast("Opening WhatsApp with your selected quotation items...", "success");
    setTimeout(() => {
      DB.clearCart();
    }, 1500);
  },

  bindEvents: function () {
    const btnSubmit = document.getElementById("btnSubmitEnquiryCart");
    if (btnSubmit) {
      btnSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        this.submitDirectEnquiry();
      });
    }

    const btnWa = document.getElementById("btnWhatsAppCart");
    if (btnWa) {
      btnWa.addEventListener("click", (e) => {
        e.preventDefault();
        this.sendWhatsAppEnquiry();
      });
    }

    const btnClear = document.getElementById("btnClearCart");
    if (btnClear) {
      btnClear.addEventListener("click", () => this.clearAll());
    }

    // Modal Close
    const closeBtn = document.getElementById("closeCartModalBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        document.getElementById("cartSuccessModal")?.classList.remove("show");
        window.location.href = "products.html";
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cartItemsContainer")) {
    CartModule.init();
  }
});

if (typeof window !== "undefined") {
  window.CartModule = CartModule;
}
