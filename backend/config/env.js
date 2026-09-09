require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  adminEmail: process.env.ADMIN_EMAIL || "support@vconstech.in",
  websiteUrl: process.env.WEBSITE_URL || "https://vconstech.in",
  crmApiBaseUrl: (process.env.CRM_API_BASE_URL || "").replace(/\/$/, ""),
  duplicateRegistrationApiBaseUrl: (process.env.DUPLICATE_REGISTRATION_API_BASE_URL || process.env.CRM_API_BASE_URL || "").replace(/\/$/, ""),
  crmDuplicateRegistrationPath: process.env.CRM_DUPLICATE_REGISTRATION_PATH || "/subscription-sync/pricing/customer",
  supabaseUrl: (process.env.SUPABASE_URL || "").replace(/\/$/, ""),
  supabaseDbUrl: process.env.SUPABASE_DB_URL || "",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  crmRequestTimeoutMs: Number(process.env.CRM_REQUEST_TIMEOUT_MS || 20000),
};

module.exports = { env };
