/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Homepage Featured Products (Supabase)
 *
 * Replaces the static "Top Selling Products" cards in index.html with
 * live featured products (featured = true) from the Supabase `products`
 * table. The static cards remain in the markup as a no-JS / offline
 * fallback and are only swapped when Supabase returns data.
 */

const HomeFeatured = {
  init: async function () {
    const grid = document.querySelector(".products-section .product-grid");
    if (!grid) return;

    if (!isSupabaseReady()) {
      console.warn("[Mahalaxmi] Supabase not configured — keeping static homepage products.");
      return;
    }

    const sb = getSupabaseClient();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error("Supabase featured products fetch failed:", error.message);
      return; // keep static fallback cards
    }

    const featured = data || [];
    if (featured.length === 0) {
      return; // keep static fallback cards
    }

    grid.innerHTML = featured.map(p => this.renderCard(p)).join("");
  },

  renderCard: function (p) {
    const img = p.image_url || "assets/products/ro-pure-copper.svg";
    const catLabel = p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : "Featured";

    const priceNow = (p.discount_price !== null && p.discount_price !== undefined) ? p.discount_price : p.price;
    const hasDiscount = (p.discount_price !== null && p.discount_price !== undefined && p.price &&
                         Number(p.discount_price) < Number(p.price));

    let pricingHtml = "";
    if (priceNow !== null && priceNow !== undefined && !isNaN(Number(priceNow))) {
      pricingHtml = `
        <div class="product-pricing">
          <span class="price-current">&#8377;${Number(priceNow).toLocaleString("en-IN")}</span>
          ${hasDiscount ? `<span class="price-old">&#8377;${Number(p.price).toLocaleString("en-IN")}</span>` : ""}
          ${hasDiscount ? `<span class="price-discount">${Math.round((1 - Number(p.discount_price) / Number(p.price)) * 100)}% OFF</span>` : ""}
        </div>
      `;
    } else {
      pricingHtml = `
        <div class="product-pricing">
          <span class="price-current">Enquire for Best Price</span>
        </div>
      `;
    }

    const waUrl = WhatsAppService.getProductEnquiryUrl(p);
    const stockOut = Number(p.stock) <= 0;

    return `
      <div class="product-card">
        <div class="product-image-wrap">
          <span class="product-badge">${stockOut ? "Out of Stock" : "Featured"}</span>
          <img
            src="${escapeHtml(img)}"
            onerror="this.onerror=null; this.src='assets/products/ro-pure-copper.svg';"
            alt="${escapeHtml(p.name)}">
        </div>
        <div class="product-info">
          <span class="product-category-chip">${escapeHtml(catLabel)}</span>
          <h3 class="product-title">${escapeHtml(p.name)}</h3>
          ${pricingHtml}
          <a
            class="btn-order-wa-only"
            href="${waUrl}"
            target="_blank"
            rel="noopener"
            style="display:flex; align-items:center; justify-content:center; gap:8px; width:100%; text-decoration:none;">
            <i class="fab fa-whatsapp"></i> Order on WhatsApp
          </a>
          <a
            href="product-details.html?id=${encodeURIComponent(p.id)}"
            style="display:flex; align-items:center; justify-content:center; gap:6px; width:100%; margin-top:8px; padding:8px 12px; font-size:0.85rem; font-weight:600; color:#0F172A; background:#F1F5F9; border:1px solid #CBD5E1; border-radius:8px; text-decoration:none;">
            <i class="fas fa-info-circle"></i> View Details
          </a>
        </div>
      </div>
    `;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  HomeFeatured.init();
});

if (typeof window !== "undefined") {
  window.HomeFeatured = HomeFeatured;
}
