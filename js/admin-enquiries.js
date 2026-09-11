/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Admin Enquiries, Service Requests & Customer Accounts Management Module
 */

const AdminEnquiries = {
  currentViewEnquiry: null,

  init: function () {
    this.renderEnquiriesTable();
    this.renderServiceRequestsTable();
    this.renderCustomersTable();
    this.bindFilters();
  },

  /**
   * ENQUIRY MANAGEMENT
   */
  renderEnquiriesTable: function () {
    const tableBody = document.getElementById("adminEnquiriesTableBody");
    if (!tableBody) return;

    const enquiries = DB.getEnquiries();
    const searchVal = document.getElementById("enquirySearchInput")?.value.toLowerCase().trim() || "";
    const statusVal = document.getElementById("enquiryStatusFilter")?.value || "";

    const filtered = enquiries.filter(enq => {
      const matchesSearch = !searchVal || (
        (enq.customerName && enq.customerName.toLowerCase().includes(searchVal)) ||
        (enq.phone && enq.phone.includes(searchVal)) ||
        (enq.email && enq.email.toLowerCase().includes(searchVal)) ||
        (enq.productName && enq.productName.toLowerCase().includes(searchVal))
      );
      const matchesStatus = !statusVal || enq.status === statusVal;
      return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 2.5rem;">No customer quotation enquiries found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(enq => {
      const cleanPhone = (enq.phone || "").replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(enq.customerName || '')},%20we%20received%20your%20quotation%20request%20from%20Mahalaxmi%20Enterprises.`;

      return `
        <tr>
          <td>
            <strong>${escapeHtml(enq.customerName)}</strong>
            <div style="font-size: 0.8rem; color: #64748B;">${escapeHtml(enq.location || 'Local')}</div>
          </td>
          <td>
            <div>${escapeHtml(enq.phone)}</div>
            <div style="font-size: 0.78rem; color: #64748B;">${escapeHtml(enq.email || '')}</div>
          </td>
          <td style="max-width: 200px;">
            <div style="font-weight: 600; color: #0F172A; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${escapeHtml(enq.productName || 'Quotation')}</div>
          </td>
          <td style="font-size: 0.85rem; color: #64748B;">${escapeHtml(enq.date || 'Recent')}</td>
          <td>
            <select class="admin-filter-select" style="padding: 0.35rem 0.6rem; font-size: 0.82rem;" onchange="AdminEnquiries.updateStatus('${enq.id}', this.value)">
              <option value="New" ${enq.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Contacted" ${enq.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="In Progress" ${enq.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${enq.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${enq.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <div class="tbl-actions">
              <button class="btn-tbl view" onclick="AdminEnquiries.viewDetails('${enq.id}')" title="View Details"><i class="fas fa-eye"></i></button>
              <a href="tel:+${cleanPhone}" class="btn-tbl view" title="Call Customer"><i class="fas fa-phone"></i></a>
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn-tbl whatsapp" title="WhatsApp Customer"><i class="fab fa-whatsapp"></i></a>
              <button class="btn-tbl delete" onclick="AdminEnquiries.deleteEnquiry('${enq.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  updateStatus: function (id, newStatus) {
    DB.update(DB_KEYS.ENQUIRIES, id, { status: newStatus });
    App.toast(`Enquiry status updated to ${newStatus}`, "success");
    this.renderEnquiriesTable();
  },

  viewDetails: function (id) {
    const enq = DB.getById(DB_KEYS.ENQUIRIES, id);
    if (!enq) return;

    this.currentViewEnquiry = enq;
    const body = document.getElementById("enquiryDetailsModalBody");
    const cleanPhone = (enq.phone || "").replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(enq.customerName || '')},%20we%20are%20contacting%20you%20from%20Mahalaxmi%20Enterprises.`;

    if (body) {
      body.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h4 style="font-size: 1.2rem; color: #0F172A;">${escapeHtml(enq.customerName)}</h4>
            <span style="font-size: 0.85rem; color: #64748B;">Date: ${escapeHtml(enq.date)} &bull; Location: ${escapeHtml(enq.location || 'N/A')}</span>
          </div>
          <span class="status-pill status-${escapeHtml((enq.status || 'new').toLowerCase().replace(/\s+/g, ''))}">${escapeHtml(enq.status)}</span>
        </div>

        <div style="background: #F8FAFC; border: 1px solid var(--admin-border); border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem; font-size: 0.9rem;">
          <div><strong>Phone:</strong> <a href="tel:+${cleanPhone}" style="color: var(--admin-accent); font-weight: 600;">${escapeHtml(enq.phone)}</a></div>
          <div style="margin-top: 0.35rem;"><strong>Email:</strong> ${escapeHtml(enq.email || 'N/A')}</div>
          <div style="margin-top: 0.35rem;"><strong>Products Inquired:</strong> ${escapeHtml(enq.productName || 'General Quotation')}</div>
        </div>

        ${enq.cartSnapshot && enq.cartSnapshot.length > 0 ? `
          <div style="margin-bottom: 1.25rem;">
            <h5 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Cart Item Breakdown:</h5>
            <ul style="padding-left: 1.2rem; font-size: 0.88rem; color: #334155;">
              ${enq.cartSnapshot.map(i => `<li><strong>${escapeHtml(i.name)}</strong> &mdash; Qty: ${escapeHtml(i.quantity || 1)} (${escapeHtml(i.brand || 'Dhanalakshmi Pureit')})</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div style="margin-bottom: 1.5rem;">
          <h5 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Customer Message / Notes:</h5>
          <div style="background: #FFFFFF; border: 1px solid var(--admin-border); border-radius: 6px; padding: 0.75rem; font-size: 0.9rem; color: #1E293B; white-space: pre-wrap;">${escapeHtml(enq.message || 'No additional message.')}</div>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <a href="tel:+${cleanPhone}" class="btn-admin-add" style="background: #0F172A;"><i class="fas fa-phone"></i> Call Customer</a>
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn-admin-add" style="background: #10B981;"><i class="fab fa-whatsapp"></i> Chat on WhatsApp</a>
        </div>
      `;
    }

    document.getElementById("enquiryDetailsModal")?.classList.add("show");
  },

  deleteEnquiry: function (id) {
    if (confirm("Delete this quotation enquiry?")) {
      DB.delete(DB_KEYS.ENQUIRIES, id);
      App.toast("Enquiry deleted", "info");
      this.renderEnquiriesTable();
    }
  },

  /**
   * SERVICE REQUEST MANAGEMENT
   */
  renderServiceRequestsTable: function () {
    const tableBody = document.getElementById("adminServiceRequestsTableBody");
    if (!tableBody) return;

    const requests = DB.getServiceRequests();

    if (requests.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94A3B8; padding: 2.5rem;">No service requests logged.</td></tr>`;
      return;
    }

    tableBody.innerHTML = requests.map(req => {
      const cleanPhone = (req.phone || "").replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(req.customerName || '')},%20we%20have%20assigned%20your%20service%20request%20for%20${encodeURIComponent(req.serviceType || '')}.`;

      return `
        <tr>
          <td>
            <strong>${escapeHtml(req.customerName)}</strong>
            <div style="font-size: 0.8rem; color: #64748B;">${escapeHtml(req.location || 'Local')}</div>
          </td>
          <td>${escapeHtml(req.phone)}</td>
          <td>
            <div><strong>${escapeHtml(req.serviceType)}</strong></div>
            <div style="font-size: 0.78rem; color: #64748B;">${escapeHtml(req.brand || 'Dhanalakshmi Pureit')} &bull; ${escapeHtml(req.model || '')}</div>
          </td>
          <td>${escapeHtml(req.preferredDate || 'Earliest')}</td>
          <td style="font-size: 0.85rem; color: #64748B;">${escapeHtml(req.date || 'Recent')}</td>
          <td>
            <select class="admin-filter-select" style="padding: 0.35rem 0.6rem; font-size: 0.82rem;" onchange="AdminEnquiries.updateServiceStatus('${req.id}', this.value)">
              <option value="New" ${req.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Assigned" ${req.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
              <option value="In Progress" ${req.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${req.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${req.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <div class="tbl-actions">
              <a href="tel:+${cleanPhone}" class="btn-tbl view" title="Call"><i class="fas fa-phone"></i></a>
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn-tbl whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
              <button class="btn-tbl delete" onclick="AdminEnquiries.deleteServiceRequest('${req.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  updateServiceStatus: function (id, newStatus) {
    DB.update(DB_KEYS.SERVICE_REQUESTS, id, { status: newStatus });
    App.toast(`Service request status updated to ${newStatus}`, "success");
    this.renderServiceRequestsTable();
  },

  deleteServiceRequest: function (id) {
    if (confirm("Delete this service request ticket?")) {
      DB.delete(DB_KEYS.SERVICE_REQUESTS, id);
      App.toast("Service request deleted", "info");
      this.renderServiceRequestsTable();
    }
  },

  /**
   * CUSTOMER MANAGEMENT
   */
  renderCustomersTable: function () {
    const tableBody = document.getElementById("adminCustomersTableBody");
    if (!tableBody) return;

    const customers = DB.getCustomers();
    const enquiries = DB.getEnquiries();

    if (customers.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94A3B8; padding: 2rem;">No registered demo customers.</td></tr>`;
      return;
    }

    tableBody.innerHTML = customers.map(c => {
      const userEnqCount = enquiries.filter(e => e.email === c.email || e.phone === c.phone).length;

      return `
        <tr>
          <td>
            <strong>${escapeHtml(c.name)}</strong>
            <div style="font-size: 0.78rem; color: #64748B;">${escapeHtml(c.location || 'Registered Customer')}</div>
          </td>
          <td>${escapeHtml(c.phone)}</td>
          <td>${escapeHtml(c.email)}</td>
          <td>${escapeHtml(c.registeredAt || 'Recent')}</td>
          <td><span class="meta-chip">${userEnqCount} enquiries</span></td>
          <td>
            <button class="status-pill ${c.status === 'Active' ? 'status-completed' : 'status-cancelled'}" style="cursor: pointer; border: none;" onclick="AdminEnquiries.toggleCustomerStatus('${c.id}')">
              ${escapeHtml(c.status || 'Active')}
            </button>
          </td>
        </tr>
      `;
    }).join("");
  },

  toggleCustomerStatus: function (id) {
    const c = DB.getById(DB_KEYS.CUSTOMERS, id);
    if (c) {
      const next = (c.status === "Active") ? "Disabled" : "Active";
      DB.update(DB_KEYS.CUSTOMERS, id, { status: next });
      this.renderCustomersTable();
      App.toast(`Account ${next}`, "info");
    }
  },

  bindFilters: function () {
    document.getElementById("enquirySearchInput")?.addEventListener("input", () => this.renderEnquiriesTable());
    document.getElementById("enquiryStatusFilter")?.addEventListener("change", () => this.renderEnquiriesTable());

    document.getElementById("btnCloseEnquiryModal")?.addEventListener("click", () => {
      document.getElementById("enquiryDetailsModal")?.classList.remove("show");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("admin-body")) {
    AdminEnquiries.init();
  }
});

if (typeof window !== "undefined") {
  window.AdminEnquiries = AdminEnquiries;
}
