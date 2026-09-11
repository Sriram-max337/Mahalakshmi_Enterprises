/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Admin Settings, Banners, FAQs, WhatsApp & Backup/Restore Module
 */

const AdminSettings = {
  currentEditBannerId: null,
  currentEditFaqId: null,

  init: function () {
    this.populateSettingsForm();
    this.populateWhatsAppForm();
    this.renderBannersTable();
    this.renderFaqTable();
    this.bindSettingsEvents();
    this.bindBannerEvents();
    this.bindFaqEvents();
    this.bindBackupEvents();
  },

  /**
   * WEBSITE SETTINGS
   */
  populateSettingsForm: function () {
    const s = DB.getSettings();
    if (!s) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };

    setVal("settingBizName", s.businessName);
    setVal("settingBrandName", s.brandName);
    setVal("settingPhone", s.phone);
    setVal("settingPhoneClean", s.phoneClean);
    setVal("settingWhatsapp", s.whatsapp);
    setVal("settingEmail", s.email);
    setVal("settingAddress", s.address);
    setVal("settingHours", s.businessHours);
    setVal("settingMaps", s.googleMapsEmbed);

    if (s.socialLinks) {
      setVal("settingFb", s.socialLinks.facebook);
      setVal("settingInsta", s.socialLinks.instagram);
      setVal("settingYt", s.socialLinks.youtube);
      setVal("settingLinkedin", s.socialLinks.linkedin);
    }

    setVal("settingFooterDesc", s.footerDescription);
    setVal("settingCopyright", s.copyrightText);
  },

  saveSettingsForm: function () {
    const getVal = (id) => document.getElementById(id)?.value.trim() || "";

    const updated = {
      businessName: getVal("settingBizName") || "Mahalaxmi Enterprises",
      brandName: getVal("settingBrandName") || "Dhanalakshmi Pureit",
      phone: getVal("settingPhone") || "+91 97014 10661",
      phoneClean: getVal("settingPhoneClean") || getVal("settingPhone").replace(/[^0-9]/g, ""),
      whatsapp: getVal("settingWhatsapp") || "9197014 10661",
      email: getVal("settingEmail") || "contact@mahalaxmipureit.com",
      address: getVal("settingAddress"),
      businessHours: getVal("settingHours"),
      googleMapsEmbed: getVal("settingMaps"),
      socialLinks: {
        facebook: getVal("settingFb"),
        instagram: getVal("settingInsta"),
        youtube: getVal("settingYt"),
        linkedin: getVal("settingLinkedin")
      },
      footerDescription: getVal("settingFooterDesc"),
      copyrightText: getVal("settingCopyright")
    };

    DB.saveSettings(updated);
    App.toast("Website settings saved successfully! Immediately reflected on customer website.", "success");
  },

  /**
   * WHATSAPP CONFIGURATION
   */
  populateWhatsAppForm: function () {
    const w = DB.getWhatsAppConfig();
    if (!w) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };

    setVal("waNumberInput", w.number);
    setVal("waDefaultMsg", w.defaultMessage);
    setVal("waProductMsg", w.productMessage);
    setVal("waCartMsg", w.cartMessage);
    setVal("waServiceMsg", w.serviceMessage);
  },

  saveWhatsAppForm: function () {
    const getVal = (id) => document.getElementById(id)?.value.trim() || "";

    const updated = {
      number: getVal("waNumberInput").replace(/[^0-9]/g, "") || "9197014 10661",
      defaultMessage: getVal("waDefaultMsg"),
      productMessage: getVal("waProductMsg"),
      cartMessage: getVal("waCartMsg"),
      serviceMessage: getVal("waServiceMsg")
    };

    DB.saveWhatsAppConfig(updated);
    App.toast("WhatsApp settings updated! All customer buttons now use new number & templates.", "success");
  },

  /**
   * HOME BANNER MANAGEMENT
   */
  renderBannersTable: function () {
    const tableBody = document.getElementById("adminBannersTableBody");
    if (!tableBody) return;

    const banners = DB.getBanners();

    tableBody.innerHTML = banners.map(b => `
      <tr>
        <td><img src="${b.image || 'assets/hero/hero-purifier.svg'}" alt="${b.heading}" class="tbl-img"></td>
        <td>
          <strong>${b.heading}</strong>
          <div style="font-size: 0.8rem; color: #64748B;">${b.subheading || ''}</div>
        </td>
        <td>
          <span class="meta-chip">${b.button1Text || 'Explore'} &rarr; ${b.button1Link || '#'}</span>
        </td>
        <td>
          <button class="status-pill ${b.status === 'active' ? 'status-completed' : 'status-inactive'}" style="cursor: pointer; border: none;" onclick="AdminSettings.toggleBannerStatus('${b.id}')">
            ${b.status || 'active'}
          </button>
        </td>
        <td>
          <div class="tbl-actions">
            <button class="btn-tbl edit" onclick="AdminSettings.openEditBannerModal('${b.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-tbl delete" onclick="AdminSettings.deleteBanner('${b.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  openAddBannerModal: function () {
    this.currentEditBannerId = null;
    document.getElementById("bannerModalTitle").textContent = "Add Homepage Hero Banner";
    document.getElementById("bannerForm").reset();
    document.getElementById("bannerImagePreview").src = "assets/hero/hero-purifier.svg";
    document.getElementById("bannerModalBackdrop").classList.add("show");
  },

  openEditBannerModal: function (id) {
    const b = DB.getById(DB_KEYS.BANNERS, id);
    if (!b) return;

    this.currentEditBannerId = b.id;
    document.getElementById("bannerModalTitle").textContent = "Edit Hero Banner";
    document.getElementById("bannerHeading").value = b.heading || "";
    document.getElementById("bannerSubheading").value = b.subheading || "";
    document.getElementById("bannerDesc").value = b.description || "";
    document.getElementById("bannerBtn1Text").value = b.button1Text || "";
    document.getElementById("bannerBtn1Link").value = b.button1Link || "";
    document.getElementById("bannerBtn2Text").value = b.button2Text || "";
    document.getElementById("bannerBtn2Link").value = b.button2Link || "";
    document.getElementById("bannerImageUrl").value = b.image || "assets/hero/hero-purifier.svg";
    document.getElementById("bannerImagePreview").src = b.image || "assets/hero/hero-purifier.svg";

    document.getElementById("bannerModalBackdrop").classList.add("show");
  },

  saveBanner: function () {
    const heading = document.getElementById("bannerHeading").value.trim();
    if (!heading) {
      App.toast("Heading is required", "error");
      return;
    }

    const subheading = document.getElementById("bannerSubheading").value.trim();
    const description = document.getElementById("bannerDesc").value.trim();
    const button1Text = document.getElementById("bannerBtn1Text").value.trim() || "Explore Products";
    const button1Link = document.getElementById("bannerBtn1Link").value.trim() || "products.html";
    const button2Text = document.getElementById("bannerBtn2Text").value.trim() || "Get Free Enquiry";
    const button2Link = document.getElementById("bannerBtn2Link").value.trim() || "contact.html";
    const image = document.getElementById("bannerImageUrl").value.trim() || "assets/hero/hero-purifier.svg";

    const bannerData = {
      heading,
      subheading,
      description,
      button1Text,
      button1Link,
      button2Text,
      button2Link,
      image,
      status: "active"
    };

    if (this.currentEditBannerId) {
      DB.update(DB_KEYS.BANNERS, this.currentEditBannerId, bannerData);
      App.toast("Banner updated successfully!", "success");
    } else {
      DB.insert(DB_KEYS.BANNERS, bannerData);
      App.toast("New hero banner added!", "success");
    }

    document.getElementById("bannerModalBackdrop").classList.remove("show");
    this.renderBannersTable();
  },

  deleteBanner: function (id) {
    if (confirm("Delete this banner?")) {
      DB.delete(DB_KEYS.BANNERS, id);
      App.toast("Banner deleted", "info");
      this.renderBannersTable();
    }
  },

  toggleBannerStatus: function (id) {
    const b = DB.getById(DB_KEYS.BANNERS, id);
    if (b) {
      const next = (b.status === "active") ? "inactive" : "active";
      DB.update(DB_KEYS.BANNERS, id, { status: next });
      this.renderBannersTable();
    }
  },

  /**
   * FAQ MANAGEMENT
   */
  renderFaqTable: function () {
    const tableBody = document.getElementById("adminFaqTableBody");
    if (!tableBody) return;

    const faqs = DB.getFaqs();

    tableBody.innerHTML = faqs.map(f => `
      <tr>
        <td><strong>${f.question}</strong></td>
        <td><span class="meta-chip">${f.category || 'General'}</span></td>
        <td style="max-width: 320px; font-size: 0.85rem; color: #64748B;">${f.answer}</td>
        <td>
          <button class="status-pill ${f.status === 'active' ? 'status-completed' : 'status-inactive'}" style="cursor: pointer; border: none;" onclick="AdminSettings.toggleFaqStatus('${f.id}')">
            ${f.status || 'active'}
          </button>
        </td>
        <td>
          <div class="tbl-actions">
            <button class="btn-tbl edit" onclick="AdminSettings.openEditFaqModal('${f.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-tbl delete" onclick="AdminSettings.deleteFaq('${f.id}')" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  openAddFaqModal: function () {
    this.currentEditFaqId = null;
    document.getElementById("faqModalTitle").textContent = "Add New FAQ";
    document.getElementById("faqForm").reset();
    document.getElementById("faqModalBackdrop").classList.add("show");
  },

  openEditFaqModal: function (id) {
    const f = DB.getById(DB_KEYS.FAQ, id);
    if (!f) return;

    this.currentEditFaqId = f.id;
    document.getElementById("faqModalTitle").textContent = "Edit FAQ";
    document.getElementById("faqQuestionInput").value = f.question || "";
    document.getElementById("faqAnswerInput").value = f.answer || "";
    document.getElementById("faqCategoryInput").value = f.category || "Water Purifiers";
    document.getElementById("faqModalBackdrop").classList.add("show");
  },

  saveFaq: function () {
    const question = document.getElementById("faqQuestionInput").value.trim();
    const answer = document.getElementById("faqAnswerInput").value.trim();
    const category = document.getElementById("faqCategoryInput").value.trim();

    if (!question || !answer) {
      App.toast("Question and answer are required", "error");
      return;
    }

    const faqData = {
      question,
      answer,
      category: category || "General",
      status: "active"
    };

    if (this.currentEditFaqId) {
      DB.update(DB_KEYS.FAQ, this.currentEditFaqId, faqData);
      App.toast("FAQ updated", "success");
    } else {
      DB.insert(DB_KEYS.FAQ, faqData);
      App.toast("FAQ added", "success");
    }

    document.getElementById("faqModalBackdrop").classList.remove("show");
    this.renderFaqTable();
  },

  deleteFaq: function (id) {
    if (confirm("Delete this FAQ item?")) {
      DB.delete(DB_KEYS.FAQ, id);
      App.toast("FAQ deleted", "info");
      this.renderFaqTable();
    }
  },

  toggleFaqStatus: function (id) {
    const f = DB.getById(DB_KEYS.FAQ, id);
    if (f) {
      const next = (f.status === "active") ? "inactive" : "active";
      DB.update(DB_KEYS.FAQ, id, { status: next });
      this.renderFaqTable();
    }
  },

  /**
   * DATA BACKUP, EXPORT & FACTORY RESET
   */
  exportData: function () {
    const dump = DB.exportAll();
    const blob = new Blob([dump], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `mahalaxmi_enterprises_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    App.toast("Database backup downloaded as JSON!", "success");
  },

  importDataFile: function (file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const res = DB.importAll(e.target.result);
      if (res.success) {
        App.toast("Database successfully restored from JSON backup!", "success");
        setTimeout(() => location.reload(), 800);
      } else {
        App.toast("Failed to import JSON: " + res.error, "error");
      }
    };
    reader.readAsText(file);
  },

  resetFactoryData: function () {
    if (confirm("WARNING: Are you sure you want to reset all data to default demo state? All your custom added products and enquiries will be replaced with clean demo seed data.")) {
      DB.resetToDefault();
      App.toast("Database reset to factory default demo seed!", "info");
      setTimeout(() => location.reload(), 700);
    }
  },

  bindSettingsEvents: function () {
    document.getElementById("btnSaveSiteSettings")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.saveSettingsForm();
    });

    document.getElementById("btnSaveWhatsAppSettings")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.saveWhatsAppForm();
    });
  },

  bindBannerEvents: function () {
    document.getElementById("btnOpenAddBanner")?.addEventListener("click", () => this.openAddBannerModal());
    document.getElementById("btnCloseBannerModal")?.addEventListener("click", () => {
      document.getElementById("bannerModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnCancelBanner")?.addEventListener("click", () => {
      document.getElementById("bannerModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnSaveBanner")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.saveBanner();
    });

    document.getElementById("bannerImageUrl")?.addEventListener("input", (e) => {
      document.getElementById("bannerImagePreview").src = e.target.value.trim() || "assets/hero/hero-purifier.svg";
    });

    document.getElementById("bannerImageFile")?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          document.getElementById("bannerImagePreview").src = loadEvt.target.result;
          document.getElementById("bannerImageUrl").value = loadEvt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  },

  bindFaqEvents: function () {
    document.getElementById("btnOpenAddFaq")?.addEventListener("click", () => this.openAddFaqModal());
    document.getElementById("btnCloseFaqModal")?.addEventListener("click", () => {
      document.getElementById("faqModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnCancelFaq")?.addEventListener("click", () => {
      document.getElementById("faqModalBackdrop").classList.remove("show");
    });
    document.getElementById("btnSaveFaq")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.saveFaq();
    });
  },

  bindBackupEvents: function () {
    document.getElementById("btnExportBackup")?.addEventListener("click", () => this.exportData());
    document.getElementById("btnResetData")?.addEventListener("click", () => this.resetFactoryData());

    const importInput = document.getElementById("importBackupInput");
    if (importInput) {
      importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) this.importDataFile(file);
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("admin-body")) {
    AdminSettings.init();
  }
});

if (typeof window !== "undefined") {
  window.AdminSettings = AdminSettings;
}
