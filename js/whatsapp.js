/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * WhatsApp Integration & Floating Action Triggers
 */

const WhatsAppService = {
  getNumber: function () {
    const config = DB.getWhatsAppConfig();
    return (config && config.number) ? config.number.replace(/[^0-9]/g, "") : "919701410661";
  },

  getCleanPhone: function () {
    const settings = DB.getSettings();
    return (settings && settings.phoneClean) ? settings.phoneClean.replace(/[^0-9]/g, "") : "919701410661";
  },

  /**
   * Build formatted WhatsApp URL with encoded message
   */
  buildUrl: function (rawMessage) {
    const num = this.getNumber();
    return `https://wa.me/${num}?text=${encodeURIComponent(rawMessage)}`;
  },

  /**
   * Product specific enquiry message
   */
  getProductEnquiryUrl: function (product) {
    const config = DB.getWhatsAppConfig();
    let tmpl = (config && config.productMessage) ? config.productMessage : DEFAULT_CONFIG.whatsapp.productMessage;
    tmpl = tmpl
      .replace(/{product}/g, product.name || "Water Purifier")
      .replace(/{model}/g, product.model || "Standard Model")
      .replace(/{brand}/g, product.brand || "Dhanalakshmi Pureit");
    return this.buildUrl(tmpl);
  },

  /**
   * Multi-product cart quotation message
   */
  getCartEnquiryUrl: function (cartItems, customer) {
    const config = DB.getWhatsAppConfig();
    let tmpl = (config && config.cartMessage) ? config.cartMessage : DEFAULT_CONFIG.whatsapp.cartMessage;
    
    let itemsText = cartItems.map((item, idx) => {
      return `${idx + 1}. *${item.name}* (Qty: ${item.quantity || 1})`;
    }).join("\n");

    tmpl = tmpl
      .replace(/{items}/g, itemsText || "Selected Products")
      .replace(/{name}/g, customer.name || "Customer")
      .replace(/{phone}/g, customer.phone || "N/A")
      .replace(/{location}/g, customer.location || "N/A")
      .replace(/{message}/g, customer.message || "Quotation requested");

    return this.buildUrl(tmpl);
  },

  /**
   * Service request message
   */
  getServiceEnquiryUrl: function (request) {
    const config = DB.getWhatsAppConfig();
    let tmpl = (config && config.serviceMessage) ? config.serviceMessage : DEFAULT_CONFIG.whatsapp.serviceMessage;
    tmpl = tmpl
      .replace(/{service}/g, request.serviceType || "Water Purifier Service")
      .replace(/{brand}/g, request.brand || "Dhanalakshmi Pureit")
      .replace(/{model}/g, request.model || "N/A")
      .replace(/{name}/g, request.name || "Customer")
      .replace(/{phone}/g, request.phone || "N/A")
      .replace(/{location}/g, request.location || "N/A")
      .replace(/{date}/g, request.preferredDate || "Earliest Available")
      .replace(/{message}/g, request.message || "Service inspection needed");

    return this.buildUrl(tmpl);
  },

  /**
   * General greeting enquiry message
   */
  getGeneralEnquiryUrl: function (customMsg) {
    const config = DB.getWhatsAppConfig();
    const msg = customMsg || (config && config.defaultMessage ? config.defaultMessage : DEFAULT_CONFIG.whatsapp.defaultMessage);
    return this.buildUrl(msg);
  },

  /**
   * Inject floating action buttons into DOM
   */
  injectFloatingButtons: function () {
    if (document.querySelector(".floating-actions")) return;

    const container = document.createElement("div");
    container.className = "floating-actions";

    const waNum = this.getNumber();
    const phoneNum = this.getCleanPhone();
    const generalUrl = this.getGeneralEnquiryUrl();

    container.innerHTML = `
      <a href="${generalUrl}" target="_blank" rel="noopener" class="float-btn float-whatsapp" aria-label="Chat on WhatsApp">
        <i class="fab fa-whatsapp"></i>
        <span class="float-tooltip">Chat with Us on WhatsApp</span>
      </a>
      <a href="tel:+${phoneNum}" class="float-btn float-call" aria-label="Call Mahalaxmi Enterprises">
        <i class="fas fa-phone-alt"></i>
        <span class="float-tooltip">Call Now: +${phoneNum}</span>
      </a>
    `;

    document.body.appendChild(container);
  }
};

if (typeof window !== "undefined") {
  window.WhatsAppService = WhatsAppService;
  document.addEventListener("DOMContentLoaded", () => {
    WhatsAppService.injectFloatingButtons();
  });
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = WhatsAppService;
}
