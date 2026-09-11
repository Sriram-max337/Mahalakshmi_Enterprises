/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Services Module: Service Catalogue & Service Request Booking Form
 */

const ServicesModule = {
  services: [],

  init: function () {
    this.services = DB.getServices();
    this.renderServicesGrid();
    this.populateServiceDropdown();
    this.bindServiceForm();

    window.addEventListener("mahalaxmi_db_update", (e) => {
      if (e.detail.key === DB_KEYS.SERVICES) {
        this.services = DB.getServices();
        this.renderServicesGrid();
        this.populateServiceDropdown();
      }
    });
  },

  renderServicesGrid: function () {
    const grid = document.getElementById("servicesGridContainer");
    if (!grid) return;

    const activeServices = this.services.filter(s => s.status !== "inactive");

    if (activeServices.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #94A3B8;">No services currently listed.</p>`;
      return;
    }

    grid.innerHTML = activeServices.map(s => `
      <div class="service-card" data-service-id="${s.id}">
        <div class="service-img-wrap">
          <img src="${s.image || 'assets/services/installation.svg'}" alt="${s.title}" loading="lazy">
        </div>
        <div class="service-body">
          <h3 class="service-title">${s.title}</h3>
          <p class="service-desc">${s.description || ''}</p>

          ${(s.benefits && s.benefits.length > 0) ? `
            <ul class="service-benefits-list">
              ${s.benefits.map(b => `<li><i class="fas fa-check-circle"></i> <span>${b}</span></li>`).join('')}
            </ul>
          ` : ''}

          <div class="service-card-footer" style="display:flex; flex-direction:column; gap:8px; margin-top:14px;">
            <a href="https://wa.me/919701410661?text=Hello%20Mahalaxmi%20Enterprises,%20I%20want%20to%20book%20service:%20${encodeURIComponent(s.title)}.%20Please%20schedule%20a%20visit." target="_blank" rel="noopener" class="btn-card-action btn-whatsapp-enq" style="background:#25D366; color:#ffffff; font-weight:700; padding:10px 14px; border-radius:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:8px; text-decoration:none; box-shadow:0 4px 12px rgba(37,211,102,0.25);">
              <i class="fab fa-whatsapp" style="font-size:16px;"></i> Book on WhatsApp (97014 10661)
            </a>
            <button class="btn-submit-primary" style="padding:0.6rem 1rem; font-size:0.85rem; background:#F1F5F9; color:#0F172A; border:1px solid #CBD5E1;" onclick="ServicesModule.selectServiceForForm('${s.title}')">
              <i class="fas fa-calendar-check"></i> Fill Request Form Below
            </button>
          </div>
        </div>
      </div>
    `).join("");
  },

  populateServiceDropdown: function () {
    const dropdown = document.getElementById("reqServiceType");
    if (!dropdown) return;

    dropdown.innerHTML = `
      <option value="">Select Service Required *</option>
      ${this.services.filter(s => s.status !== "inactive").map(s => `
        <option value="${s.title}">${s.title}</option>
      `).join("")}
      <option value="General Inspection / Not Sure">General Inspection / Not Sure</option>
    `;
  },

  selectServiceForForm: function (serviceTitle) {
    const dropdown = document.getElementById("reqServiceType");
    if (dropdown) {
      dropdown.value = serviceTitle;
    }
    const formSec = document.getElementById("serviceRequestSection");
    if (formSec) {
      formSec.scrollIntoView({ behavior: "smooth" });
    }
  },

  bindServiceForm: function () {
    const form = document.getElementById("serviceRequestForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const customerName = document.getElementById("reqCustomerName")?.value.trim();
      const phone = document.getElementById("reqPhone")?.value.trim();
      const brand = document.getElementById("reqBrand")?.value.trim();
      const model = document.getElementById("reqModel")?.value.trim();
      const serviceType = document.getElementById("reqServiceType")?.value;
      const location = document.getElementById("reqLocation")?.value.trim();
      const preferredDate = document.getElementById("reqPreferredDate")?.value;
      const message = document.getElementById("reqMessage")?.value.trim();

      if (!customerName || !phone || !serviceType) {
        App.toast("Please fill in Customer Name, Phone, and select the Service.", "error");
        return;
      }

      const requestRecord = {
        customerName,
        phone,
        brand: brand || "Dhanalakshmi Pureit",
        model: model || "Standard",
        serviceType,
        location: location || "Not provided",
        preferredDate: preferredDate || "Earliest available",
        message: message || "Service requested via website",
        date: new Date().toLocaleString(),
        status: "New"
      };

      // Save to LocalStorage
      DB.insert(DB_KEYS.SERVICE_REQUESTS, requestRecord);

      // Offer WhatsApp option
      const waUrl = WhatsAppService.getServiceEnquiryUrl({
        serviceType,
        brand,
        model,
        name: customerName,
        phone,
        location,
        preferredDate,
        message
      });

      const modal = document.getElementById("serviceSuccessModal");
      if (modal) {
        modal.classList.add("show");
        const waLinkBtn = document.getElementById("modalSendWaService");
        if (waLinkBtn) {
          waLinkBtn.href = waUrl;
        }
      } else {
        App.toast("Service request registered! Our technician will call you shortly.", "success");
      }

      form.reset();
    });

    const closeBtn = document.getElementById("closeServiceModalBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        document.getElementById("serviceSuccessModal")?.classList.remove("show");
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("servicesGridContainer") || document.getElementById("serviceRequestForm")) {
    ServicesModule.init();
  }
});

if (typeof window !== "undefined") {
  window.ServicesModule = ServicesModule;
}
