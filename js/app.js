/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Main Application Logic (Header, Footer, Settings Sync, Toasts, Badges, Mobile App-like Experience)
 */

const App = {
  init: function () {
    this.bindSettings();
    this.bindMobileNav();
    this.injectMobileBottomNav();
    this.updateBadges();
    this.setupToastContainer();

    // Listen for cross-component LocalStorage updates
    window.addEventListener("mahalaxmi_db_update", (e) => {
      this.updateBadges();
      if (e.detail.key === DB_KEYS.SETTINGS || e.detail.key === DB_KEYS.WHATSAPP) {
        this.bindSettings();
      }
    });
  },

  /**
   * Escape text for safe interpolation into HTML templates.
   * Use for ALL customer/admin-submitted strings inside innerHTML templates.
   */
  escapeHtml: function (value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  /**
   * Bind business settings into DOM elements with [data-setting] attributes
   */
  bindSettings: function () {
    const settings = DB.getSettings();
    if (!settings) return;

    document.querySelectorAll("[data-setting]").forEach(el => {
      const key = el.getAttribute("data-setting");
      if (settings[key] !== undefined) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.value = settings[key];
        } else if (el.tagName === "A") {
          if (key === "phone" || key === "phoneClean") {
            el.href = `tel:+${settings.phoneClean || settings.phone.replace(/[^0-9]/g, "")}`;
            el.textContent = settings.phone;
          } else if (key === "email") {
            el.href = `mailto:${settings.email}`;
            el.textContent = settings.email;
          } else if (key === "googleMapsEmbed" || key === "mapsUrl") {
            el.href = settings.googleMapsEmbed || "#";
          } else {
            el.textContent = settings[key];
          }
        } else if (el.tagName === "IFRAME") {
          el.src = settings.googleMapsEmbed;
        } else {
          el.textContent = settings[key];
        }
      }
    });

    if (settings.socialLinks) {
      document.querySelectorAll("[data-social]").forEach(el => {
        const net = el.getAttribute("data-social");
        if (settings.socialLinks[net]) {
          el.href = settings.socialLinks[net];
        }
      });
    }
  },

  /**
   * Update badges for Enquiry Cart and Compare across Topbar and Mobile Bottom Bar
   */
  updateBadges: function () {
    const cart = DB.getCart();
    const compare = DB.getCompare();

    const totalCartItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const totalCompare = compare.length;

    // Top badges
    document.querySelectorAll(".cart-badge, .bottom-cart-badge").forEach(el => {
      el.textContent = totalCartItems;
      if (totalCartItems > 0) {
        el.classList.remove("zero");
      } else {
        el.classList.add("zero");
      }
    });

    document.querySelectorAll(".compare-badge, .bottom-compare-badge").forEach(el => {
      el.textContent = totalCompare;
      if (totalCompare > 0) {
        el.classList.remove("zero");
      } else {
        el.classList.add("zero");
      }
    });
  },

  /**
   * Enhanced Mobile Drawer with Backdrop and Close Control
   */
  bindMobileNav: function () {
    const toggleBtn = document.querySelector(".mobile-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!navLinks) return;

    // Create backdrop overlay if not present
    let backdrop = document.querySelector(".nav-drawer-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "nav-drawer-backdrop";
      document.body.appendChild(backdrop);
    }

    // Prepend header with logo & close button inside drawer
    if (!navLinks.querySelector(".nav-drawer-header")) {
      const drawerHeader = document.createElement("div");
      drawerHeader.className = "nav-drawer-header";
      drawerHeader.innerHTML = `
        <img src="assets/logo.svg" alt="Dhanalakshmi Pureit">
        <button class="nav-drawer-close" aria-label="Close menu">&times;</button>
      `;
      navLinks.insertBefore(drawerHeader, navLinks.firstChild);

      drawerHeader.querySelector(".nav-drawer-close").addEventListener("click", () => {
        navLinks.classList.remove("show");
        backdrop.classList.remove("show");
      });
    }

    // Append quick contact box at the bottom of drawer
    if (!navLinks.querySelector(".nav-drawer-contact-box")) {
      const contactBox = document.createElement("div");
      contactBox.className = "nav-drawer-contact-box";
      const cleanPhone = DB.getSettings()?.phoneClean || "9197014 10661";
      contactBox.innerHTML = `
        <div style="font-size: 0.8rem; font-weight: 700; color: #64748B; text-transform: uppercase;">Direct Support</div>
        <div style="display: flex; gap: 0.5rem;">
          <a href="tel:+${cleanPhone}" class="btn-card-action btn-view" style="flex: 1; padding: 0.6rem 0.4rem; font-size: 0.82rem;">
            <i class="fas fa-phone-alt"></i> Call
          </a>
          <a href="${WhatsAppService.getGeneralEnquiryUrl()}" target="_blank" rel="noopener" class="btn-card-action btn-whatsapp-enq" style="flex: 1; padding: 0.6rem 0.4rem; font-size: 0.82rem;">
            <i class="fab fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      `;
      navLinks.appendChild(contactBox);
    }

    const openDrawer = () => {
      navLinks.classList.add("show");
      backdrop.classList.add("show");
    };

    const closeDrawer = () => {
      navLinks.classList.remove("show");
      backdrop.classList.remove("show");
    };

    if (toggleBtn) {
      toggleBtn.addEventListener("click", openDrawer);
    }

    backdrop.addEventListener("click", closeDrawer);

    navLinks.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", closeDrawer);
    });
  },

  /**
   * Inject Native App-Like Sticky Bottom Navigation Bar on Mobile
   */
  injectMobileBottomNav: function () {
    // Only on customer pages, not admin
    if (document.body.classList.contains("admin-body") || document.querySelector(".mobile-bottom-nav")) {
      return;
    }

    const currentPath = window.location.pathname.toLowerCase();
    const isHome = currentPath.endsWith("index.html") || currentPath.endsWith("/") || currentPath.endsWith("mahalaxmi-enterprises");
    const isProducts = currentPath.includes("products.html") || currentPath.includes("product-details.html");
    const isCompare = currentPath.includes("compare.html");
    const isCart = currentPath.includes("cart.html");

    const bottomNav = document.createElement("nav");
    bottomNav.className = "mobile-bottom-nav";
    bottomNav.setAttribute("aria-label", "Mobile Bottom Navigation");

    const waUrl = WhatsAppService.getGeneralEnquiryUrl();

    bottomNav.innerHTML = `
      <a href="index.html" class="bottom-nav-item ${isHome ? 'active' : ''}">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </a>

      <a href="products.html" class="bottom-nav-item ${isProducts ? 'active' : ''}">
        <i class="fas fa-tint"></i>
        <span>Purifiers</span>
      </a>

      <a href="compare.html" class="bottom-nav-item ${isCompare ? 'active' : ''}">
        <i class="fas fa-balance-scale"></i>
        <span>Compare</span>
        <span class="bottom-badge bottom-compare-badge zero">0</span>
      </a>

      <a href="cart.html" class="bottom-nav-item ${isCart ? 'active' : ''}">
        <i class="fas fa-shopping-cart"></i>
        <span>Cart</span>
        <span class="bottom-badge bottom-cart-badge zero">0</span>
      </a>

      <a href="${waUrl}" target="_blank" rel="noopener" class="bottom-nav-item" style="color: #25D366;">
        <i class="fab fa-whatsapp"></i>
        <span>WhatsApp</span>
      </a>
    `;

    document.body.appendChild(bottomNav);
  },

  setupToastContainer: function () {
    if (!document.querySelector(".toast-container")) {
      const tc = document.createElement("div");
      tc.className = "toast-container";
      document.body.appendChild(tc);
    }
  },

  toast: function (message, type = "info") {
    this.setupToastContainer();
    const container = document.querySelector(".toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-triangle";

    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-30px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  formatPrice: function (val) {
    if (!val || val === "Enquire" || isNaN(val)) return val || "Enquire for Best Price";
    return "₹" + Number(val).toLocaleString("en-IN");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

if (typeof window !== "undefined") {
  window.App = App;
  // Global shorthand for template escaping in all modules
  window.escapeHtml = function (value) {
    return App.escapeHtml(value);
  };
}
