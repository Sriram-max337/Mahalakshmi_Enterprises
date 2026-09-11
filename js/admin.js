/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Admin Dashboard Core: Supabase Auth Check, Navigation, Dashboard KPI Metrics & Recent Enquiries
 */

const AdminApp = {
  activeTab: "dashboard",
  _authFailed: false,

  init: async function () {
    await this.checkAdminAuth();
    if (this._authFailed) return;

    this.bindSidebarNav();
    this.bindMobileSidebar();
    await this.renderDashboardStats();
    this.renderRecentEnquiries();
    this.bindAdminLogout();

    // Listen for database changes to update stats & tables live
    window.addEventListener("mahalaxmi_db_update", () => {
      this.renderDashboardStats();
      if (this.activeTab === "dashboard") {
        this.renderRecentEnquiries();
      }
    });
  },

  checkAdminAuth: async function () {
    if (!isSupabaseReady()) {
      this._authFailed = true;
      App.toast("Supabase is not configured. Edit js/supabase-config.js.", "error");
      window.location.href = "admin-login.html";
      return;
    }

    const sb = getSupabaseClient();
    const { data, error } = await sb.auth.getSession();
    const session = data && data.session;

    if (error || !session) {
      // No valid Supabase session — bounce to the login screen
      window.location.href = "admin-login.html";
      return;
    }

    // Session exists — but is this user an admin? A valid login alone no
    // longer grants access; the user must have a row in the `admins` table.
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      try {
        await sb.auth.signOut(); // don't leave a useless session behind
      } catch (signOutErr) {
        console.error("Supabase signOut failed:", signOutErr);
      }
      window.location.href = "admin-login.html?reason=not-admin";
      return;
    }

    this._authFailed = false;
  },

  bindSidebarNav: function () {
    const menuItems = document.querySelectorAll(".sidebar-item a[data-tab-target]");
    menuItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = item.getAttribute("data-tab-target");
        this.switchTab(targetId);
      });
    });
  },

  switchTab: function (tabId) {
    this.activeTab = tabId;

    // Update sidebar active styling
    document.querySelectorAll(".sidebar-item").forEach(li => li.classList.remove("active"));
    const activeLink = document.querySelector(`.sidebar-item a[data-tab-target="${tabId}"]`);
    if (activeLink && activeLink.parentElement) {
      activeLink.parentElement.classList.add("active");
    }

    // Switch visible tab pane
    document.querySelectorAll(".admin-tab-pane").forEach(pane => pane.classList.remove("active"));
    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) {
      targetPane.classList.add("active");
    }

    // Close mobile drawer if open
    document.querySelector(".admin-sidebar")?.classList.remove("open");

    // Trigger tab specific renders
    if (tabId === "dashboard") {
      this.renderDashboardStats();
      this.renderRecentEnquiries();
    } else if (tabId === "products" && window.AdminProducts) {
      window.AdminProducts.renderProductsTable();
    } else if (tabId === "categories" && window.AdminProducts) {
      window.AdminProducts.renderCategoriesTable();
    } else if (tabId === "services" && window.AdminServices) {
      window.AdminServices.renderServicesTable();
    } else if (tabId === "solar" && window.AdminServices) {
      window.AdminServices.renderSolarTable();
    } else if (tabId === "enquiries" && window.AdminEnquiries) {
      window.AdminEnquiries.renderEnquiriesTable();
    } else if (tabId === "service-requests" && window.AdminEnquiries) {
      window.AdminEnquiries.renderServiceRequestsTable();
    } else if (tabId === "customers" && window.AdminEnquiries) {
      window.AdminEnquiries.renderCustomersTable();
    } else if (tabId === "banners" && window.AdminSettings) {
      window.AdminSettings.renderBannersTable();
    } else if (tabId === "faq" && window.AdminSettings) {
      window.AdminSettings.renderFaqTable();
    } else if (tabId === "settings" && window.AdminSettings) {
      window.AdminSettings.populateSettingsForm();
    } else if (tabId === "whatsapp" && window.AdminSettings) {
      window.AdminSettings.populateWhatsAppForm();
    }
  },

  bindMobileSidebar: function () {
    const toggleBtn = document.getElementById("sidebarToggleBtn");
    const sidebar = document.querySelector(".admin-sidebar");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }
  },

  /**
   * Total products live in Supabase now; other counters stay LocalStorage.
   */
  getProductsCount: async function () {
    if (!isSupabaseReady()) return 0;
    const sb = getSupabaseClient();
    const { count, error } = await sb
      .from("products")
      .select("id", { count: "exact", head: true });
    if (error) {
      console.error("Supabase product count failed:", error.message);
      return 0;
    }
    return count || 0;
  },

  renderDashboardStats: async function () {
    const productsCount = await this.getProductsCount();
    const enquiries = DB.getEnquiries();
    const serviceRequests = DB.getServiceRequests();
    const customers = DB.getCustomers();
    const categories = DB.getCategories();

    const statProducts = document.getElementById("statTotalProducts");
    const statEnquiries = document.getElementById("statTotalEnquiries");
    const statRequests = document.getElementById("statTotalServiceRequests");
    const statCustomers = document.getElementById("statTotalCustomers");
    const statCategories = document.getElementById("statTotalCategories");

    if (statProducts) statProducts.textContent = productsCount;
    if (statEnquiries) statEnquiries.textContent = enquiries.length;
    if (statRequests) statRequests.textContent = serviceRequests.length;
    if (statCustomers) statCustomers.textContent = customers.length;
    if (statCategories) statCategories.textContent = categories.length;

    // Sidebar badges
    const bEnq = document.getElementById("badgeSidebarEnquiries");
    if (bEnq) {
      const newEnq = enquiries.filter(e => e.status === "New").length;
      bEnq.textContent = newEnq;
      bEnq.style.display = newEnq > 0 ? "inline-block" : "none";
    }

    const bSrv = document.getElementById("badgeSidebarService");
    if (bSrv) {
      const newSrv = serviceRequests.filter(s => s.status === "New").length;
      bSrv.textContent = newSrv;
      bSrv.style.display = newSrv > 0 ? "inline-block" : "none";
    }
  },

  renderRecentEnquiries: function () {
    const tableBody = document.getElementById("recentEnquiriesTableBody");
    if (!tableBody) return;

    const enquiries = DB.getEnquiries().slice(0, 5); // top 5 recent

    if (enquiries.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94A3B8; padding: 2rem;">No enquiries received yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = enquiries.map(enq => {
      const cleanPhone = (enq.phone || "").replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(enq.customerName || '')},%20this%20is%20Mahalaxmi%20Enterprises%20regarding%20your%20enquiry.`;

      return `
        <tr>
          <td><strong>${escapeHtml(enq.customerName)}</strong></td>
          <td>${escapeHtml(enq.phone)}</td>
          <td>${escapeHtml(enq.productName || 'General Enquiry')}</td>
          <td>${escapeHtml(enq.date || 'Recent')}</td>
          <td>
            <select class="admin-filter-select" style="padding: 0.3rem 0.5rem; font-size: 0.8rem;" onchange="AdminApp.updateEnquiryStatus('${enq.id}', this.value)">
              <option value="New" ${enq.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Contacted" ${enq.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="In Progress" ${enq.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${enq.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${enq.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <div class="tbl-actions">
              <a href="tel:+${cleanPhone}" class="btn-tbl view" title="Call Customer"><i class="fas fa-phone"></i></a>
              <a href="${waUrl}" target="_blank" rel="noopener" class="btn-tbl whatsapp" title="Chat on WhatsApp"><i class="fab fa-whatsapp"></i></a>
              <button class="btn-tbl delete" onclick="AdminApp.deleteEnquiry('${enq.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  updateEnquiryStatus: function (id, newStatus) {
    DB.update(DB_KEYS.ENQUIRIES, id, { status: newStatus });
    App.toast(`Enquiry status updated to ${newStatus}`, "success");
    this.renderDashboardStats();
  },

  deleteEnquiry: function (id) {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      DB.delete(DB_KEYS.ENQUIRIES, id);
      App.toast("Enquiry deleted", "info");
      this.renderRecentEnquiries();
      this.renderDashboardStats();
    }
  },

  bindAdminLogout: function () {
    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        // Sign out of Supabase Auth first
        if (isSupabaseReady()) {
          try {
            await getSupabaseClient().auth.signOut();
          } catch (err) {
            console.error("Supabase signOut failed:", err);
          }
        }
        App.toast("Admin logged out.", "info");
        setTimeout(() => {
          window.location.href = "admin-login.html";
        }, 500);
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("admin-body")) {
    AdminApp.init();
  }
});

if (typeof window !== "undefined") {
  window.AdminApp = AdminApp;
}
