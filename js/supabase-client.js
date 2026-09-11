/**
 * MAHALAXMI ENTERPRISES / DHANALAKSHMI PUREIT
 * Supabase Client Bootstrap (loaded after the SDK script tag and supabase-config.js)
 */

if (typeof window !== "undefined") {
  if (typeof supabase === "undefined" || !supabase.createClient) {
    console.error(
      "Supabase SDK not loaded. Ensure the @supabase/supabase-js@2 CDN <script> tag " +
      "appears BEFORE js/supabase-client.js on every page that uses it."
    );
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.SUPABASE_CONFIG || {};

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY ||
      SUPABASE_URL.includes("YOUR-PROJECT-REF") ||
      SUPABASE_ANON_KEY.includes("YOUR-SUPABASE-ANON-KEY")) {
    console.warn(
      "[Mahalaxmi] Supabase is not configured yet. Edit js/supabase-config.js and set " +
      "SUPABASE_URL and SUPABASE_ANON_KEY (Dashboard -> Settings -> API)."
    );
  }

  const _supabase = (typeof supabase !== "undefined" && supabase.createClient && SUPABASE_URL && SUPABASE_ANON_KEY)
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,       // session survives reloads via localStorage
          autoRefreshToken: true
        }
      })
    : null;

  /** True when the client is configured and ready to make calls. */
  window.isSupabaseReady = function () {
    return !!_supabase;
  };

  /**
   * Fetch all products (public read, no auth needed thanks to RLS).
   * Returns an array of product rows, or [] on error (error is surfaced via toast).
   */
  window.fetchAllProducts = async function () {
    if (!_supabase) {
      if (window.App && App.toast) App.toast("Supabase is not configured. Edit js/supabase-config.js.", "error");
      console.error("[Mahalaxmi] fetchAllProducts called but Supabase client is not initialized.");
      return [];
    }
    const { data, error } = await _supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase products fetch failed:", error.message);
      if (window.App && App.toast) App.toast("Could not load products: " + error.message, "error");
      return [];
    }
    return data || [];
  };

  /**
   * Authorization check: is the currently signed-in Supabase user a member of
   * the `admins` table? A valid auth session alone no longer grants admin
   * access — the user must have a matching row in `admins` (id = auth user's
   * UUID). Used by both admin-login.html (before redirecting) and admin.html
   * (on every page load).
   *
   * Note: this SELECT relies on an RLS policy on `admins` letting authenticated
   * users read their own row (see supabase/sql/*-admin-scoped-policies.sql).
   */
  window.isCurrentUserAdmin = async function () {
    if (!_supabase) return false;
    const { data: sessionData, error: sessionError } = await _supabase.auth.getSession();
    const session = sessionData && sessionData.session;
    if (sessionError || !session || !session.user) return false;

    const { data, error } = await _supabase
      .from("admins")
      .select("id")
      .eq("id", session.user.id)
      .maybeSingle();
    if (error) {
      console.error("[Mahalaxmi] Admin membership check failed:", error.message);
      return false;
    }
    return !!data;
  };

  /** Keep a reference for modules that need to make their own queries. */
  window.getSupabaseClient = function () {
    return _supabase;
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { getSupabaseClient: () => (typeof _supabase !== "undefined" ? _supabase : null) };
}
