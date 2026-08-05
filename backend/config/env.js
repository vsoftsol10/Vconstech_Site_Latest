require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  adminEmail: process.env.ADMIN_EMAIL || "support@vconstech.in",
  websiteUrl: process.env.WEBSITE_URL || "https://vconstech.in",
  crmApiBaseUrl: (process.env.CRM_API_BASE_URL || "").replace(/\/$/, ""),
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
};

module.exports = { env };
