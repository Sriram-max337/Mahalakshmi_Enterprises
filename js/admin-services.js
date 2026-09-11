/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Admin Services & Solar Solutions Management Module
 */

const AdminServices = {
  currentEditServiceId: null,
  currentEditSolarId: null,

  init: function () {
    this.renderServicesTable();
    this.renderSolarTable();
    this.bindServiceEvents();
    this.bindSolarEvents();
  },

  /**
   * SERVICES MANAGEMENT
   */
  renderServicesTable: function () {
    const tableBody = document.getElementById("adminServicesTableBody");
    if (!tableBody) return;

    const services = DB.getServices();

    if (services.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94A3B8; padding: 2rem;">No services listed.</td></tr>`;
      return;
    }

    tableBody.innerHTML = services.map(s => `
      <tr>
        <td><img src="${s.image || 'assets/services/installation.svg'}" alt="${s.title}" class="tbl-img"></td>
        <td><strong>${s.title}</strong></td>
        <td style="max-width: 320px; font-size: 0.85rem; color: #475569;">${s.description || ''}</td>
        <td>
          <button class="status-pill ${s.status === 'active' ? 'status-completed' : 'status-inactive'}" style="cursor: pointer; border: none;" onclick="AdminServices.toggleServiceStatus('${s.id}')">
            ${s.status || 'active'}
          </button>
        </td>
        <td>
          <div class="tbl-actions">
            <button class="btn-tbl edit" onclick="AdminServices.openEditServiceModal('${s.id}')" title="Edit Service"><i class="fas fa-edit"></i></button>
            <button class="btn-tbl delete" onclick="AdminServices.deleteService('${s.id}')" title="Delete Service"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  openAddServiceModal: function () {
    this.currentEditServiceId = null;
    document.getElementById("serviceModalTitle").textContent = "Add New Service";
    document.getElementById("serviceForm").reset();
    document.getElementById("serviceImagePreview").src = "assets/services/installation.svg";
    document.getElementById("serviceModalBackdrop").classList.add("show");
  },

  openEditServiceModal: function (id) {
    const s = DB.getById(DB_KEYS.SERVICES, id);
    if (!s) return;

    this.currentEditServiceId = s.id;
    document.getElementById("serviceModalTitle").textContent = "Edit Service: " + s.title;
    document.getElementById("servTitle").value = s.title || "";
    document.getElementById("servDesc").value = s.description || "";
    document.getElementById("servBenefits").value = (s.benefits && Array.isArray(s.benefits)) ? s.benefits.join("\n") : "";
    document.getElementById("servImageUrl").value = s.image || "assets/services/installation.svg";
    document.getElementById("serviceImagePreview").src = s.image || "assets/services/installation.svg";
    document.getElementById("serviceModalBackdrop").classList.add("show");
  },

  saveService: function () {
    const title = document.getElementById("servTitle").value.trim();
    if (!title) {
      App.toast("Service title is required", "error");
      return;
    }

    const description = document.getElementById("servDesc").value.trim();
    const benefitsRaw = document.getElementById("servBenefits").value;
    const benefits = benefitsRaw.split("\n").map(b => b.trim()).filter(b => b.length > 0);
    const image = document.getElementById("servImageUrl").value.trim() || "assets/services/installation.svg";

    const serviceData = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      benefits,
      image,
      status: "active"
    };

    if (this.currentEditServiceId) {
      DB.update(DB_KEYS.SERVICES, this.currentEditServiceId, serviceData);
      App.toast(`Service "${title}" updated`, "success");
    } else {
      DB.insert(DB_KEYS.SERVICES, serviceData);
      App.toast(`Service "${title}" added`, "success");
    }

    document.getElementById("serviceModalBackdrop").classList.remove("show");
    this.renderServicesTable();
  },

  deleteService: function (id) {
    const s = DB.getById(DB_KEYS.SERVICES, id);
    if (confirm(`Delete service "${s?.title}"? It will disappear from the customer services page.`)) {
      DB.delete(DB_KEYS.SERVICES, id);
      App.toast("Service deleted", "info");
      this.renderServicesTable();
    }
  },

  toggleServiceStatus: function (id) {
    const s = DB.getById(DB_KEYS.SERVICES, id);
    if (s) {
      const nextStatus = (s.status === "active") ? "inactive" : "active";
      DB.update(DB_KEYS.SERVICES, id, { status: nextStatus });
      this.renderServicesTable();
    }
  },

  bindServiceEvents: function () {
    document.getElementById("btnOpenAddService")?.addEventListener("click", () => this.openAddServiceModal());
    document.getElementById("btnCloseServiceModal")?.addEventListener("click", () => {
      document.getElementById("serviceModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnCancelService")?.addEventListener("click", () => {
      document.getElementById("serviceModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnSaveService")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.saveService();
    });

    // Image preview update
    document.getElementById("servImageUrl")?.addEventListener("input", (e) => {
      document.getElementById("serviceImagePreview").src = e.target.value.trim() || "assets/services/installation.svg";
    });

    document.getElementById("servImageFile")?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          document.getElementById("serviceImagePreview").src = loadEvt.target.result;
          document.getElementById("servImageUrl").value = loadEvt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  },

  /**
   * SOLAR MANAGEMENT
   */
  renderSolarTable: function () {
    const tableBody = document.getElementById("adminSolarTableBody");
    if (!tableBody) return;

    const solarItems = DB.getSolar();

    if (solarItems.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94A3B8; padding: 2rem;">No solar solutions listed.</td></tr>`;
      return;
    }

    tableBody.innerHTML = solarItems.map(sol => `
      <tr>
        <td><img src="${sol.image || 'assets/solar/solar-inverter.svg'}" alt="${sol.name}" class="tbl-img"></td>
        <td><strong>${sol.name}</strong></td>
        <td><span class="meta-chip">${sol.category || 'Solar'}</span></td>
        <td>${sol.capacity || 'N/A'}</td>
        <td>
          <button class="status-pill ${sol.status === 'active' ? 'status-completed' : 'status-inactive'}" style="cursor: pointer; border: none;" onclick="AdminServices.toggleSolarStatus('${sol.id}')">
            ${sol.status || 'active'}
          </button>
        </td>
        <td>
          <div class="tbl-actions">
            <button class="btn-tbl edit" onclick="AdminServices.openEditSolarModal('${sol.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-tbl delete" onclick="AdminServices.deleteSolar('${sol.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  openAddSolarModal: function () {
    this.currentEditSolarId = null;
    document.getElementById("solarModalTitle").textContent = "Add Solar Solution / Product";
    document.getElementById("solarForm").reset();
    document.getElementById("solarImagePreview").src = "assets/solar/solar-inverter.svg";
    document.getElementById("solarModalBackdrop").classList.add("show");
  },

  openEditSolarModal: function (id) {
    const item = DB.getById(DB_KEYS.SOLAR, id);
    if (!item) return;

    this.currentEditSolarId = item.id;
    document.getElementById("solarModalTitle").textContent = "Edit: " + item.name;
    document.getElementById("solarName").value = item.name || "";
    document.getElementById("solarCategory").value = item.category || "Solar Inverters";
    document.getElementById("solarCapacity").value = item.capacity || "";
    document.getElementById("solarDesc").value = item.description || "";
    document.getElementById("solarFeatures").value = (item.features && Array.isArray(item.features)) ? item.features.join("\n") : "";
    document.getElementById("solarImageUrl").value = item.image || "assets/solar/solar-inverter.svg";
    document.getElementById("solarImagePreview").src = item.image || "assets/solar/solar-inverter.svg";

    document.getElementById("solarModalBackdrop").classList.add("show");
  },

  saveSolar: function () {
    const name = document.getElementById("solarName").value.trim();
    if (!name) {
      App.toast("Name is required", "error");
      return;
    }

    const category = document.getElementById("solarCategory").value;
    const capacity = document.getElementById("solarCapacity").value.trim();
    const description = document.getElementById("solarDesc").value.trim();
    const featuresRaw = document.getElementById("solarFeatures").value;
    const features = featuresRaw.split("\n").map(f => f.trim()).filter(f => f.length > 0);
    const image = document.getElementById("solarImageUrl").value.trim() || "assets/solar/solar-inverter.svg";

    const solarData = {
      name,
      category,
      capacity,
      description,
      features,
      image,
      status: "active"
    };

    if (this.currentEditSolarId) {
      DB.update(DB_KEYS.SOLAR, this.currentEditSolarId, solarData);
      App.toast(`Solar solution "${name}" updated`, "success");
    } else {
      DB.insert(DB_KEYS.SOLAR, solarData);
      App.toast(`Solar solution "${name}" added`, "success");
    }

    document.getElementById("solarModalBackdrop").classList.remove("show");
    this.renderSolarTable();
  },

  deleteSolar: function (id) {
    const item = DB.getById(DB_KEYS.SOLAR, id);
    if (confirm(`Delete solar item "${item?.name}"?`)) {
      DB.delete(DB_KEYS.SOLAR, id);
      App.toast("Solar item deleted", "info");
      this.renderSolarTable();
    }
  },

  toggleSolarStatus: function (id) {
    const item = DB.getById(DB_KEYS.SOLAR, id);
    if (item) {
      const nextStatus = (item.status === "active") ? "inactive" : "active";
      DB.update(DB_KEYS.SOLAR, id, { status: nextStatus });
      this.renderSolarTable();
    }
  },

  bindSolarEvents: function () {
    document.getElementById("btnOpenAddSolar")?.addEventListener("click", () => this.openAddSolarModal());
    document.getElementById("btnCloseSolarModal")?.addEventListener("click", () => {
      document.getElementById("solarModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnCancelSolar")?.addEventListener("click", () => {
      document.getElementById("solarModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnSaveSolar")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.saveSolar();
    });

    document.getElementById("solarImageUrl")?.addEventListener("input", (e) => {
      document.getElementById("solarImagePreview").src = e.target.value.trim() || "assets/solar/solar-inverter.svg";
    });

    document.getElementById("solarImageFile")?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          document.getElementById("solarImagePreview").src = loadEvt.target.result;
          document.getElementById("solarImageUrl").value = loadEvt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("admin-body")) {
    AdminServices.init();
  }
});

if (typeof window !== "undefined") {
  window.AdminServices = AdminServices;
}
