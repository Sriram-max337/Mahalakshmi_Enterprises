const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable.");
  process.exit(1);
}

const output = `/**
 * AUTO-GENERATED at build time from environment variables.
 * Do not edit directly — edit build-config.js or the env vars instead.
 * See README for local development setup.
 */
const SUPABASE_CONFIG = window.__SUPABASE_CONFIG__ || {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_ANON_KEY: "${SUPABASE_ANON_KEY}"
};

if (typeof window !== "undefined") {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = SUPABASE_CONFIG;
}
`;

fs.writeFileSync(path.join(__dirname, "js", "supabase-config.js"), output);
console.log("js/supabase-config.js generated from environment variables.");
