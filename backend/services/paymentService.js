const crypto = require("crypto");
const Razorpay = require("razorpay");

const { env } = require("../config/env");
const { fetchPlansFromCrm } = require("./plansService");
const { sendEmail } = require("./brevoEmailService");

const normalizePlanName = (value) =>
  String(value || "").trim().toLowerCase().replace(/\s+/g, " ");

const isAdvancedPlan = (planName) => {
  const normalized = normalizePlanName(planName);
  return normalized.includes("advanced") || normalized === "advance" || normalized === "pro";
};

const normalizeRegistrationValue = (value) =>
  String(value || "").trim().toLowerCase().replace(/\s+/g, " ");

const hasActiveSubscription = (customer) =>
  normalizeRegistrationValue(customer?.subscriptionStatus) === "subscription_active";

const hasActivePaidAccount = (accountStatus, packageValue) => {
  const normalizedAccountStatus = normalizeRegistrationValue(accountStatus);
  const packageName = normalizeRegistrationValue(packageValue);

  return normalizedAccountStatus === "active" && Boolean(packageName) && packageName !== "free";
};

const redactEmail = (value) => {
  const [localPart, domain] = String(value || "").split("@");
  return domain ? `${localPart.slice(0, 2)}***@${domain}` : "[redacted]";
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatPaymentAmount = (amount) => {
  const numericAmount = Number(amount);
  return Number.isFinite(numericAmount) && numericAmount > 0
    ? `₹${numericAmount.toLocaleString("en-IN")}`
    : "Not available";
};

const sendPaymentConfirmationEmail = async ({ paymentId, purchaseData = {}, activated }) => {
  const recipient = String(purchaseData.email || "").trim();

  if (!recipient) {
    const error = "Customer email is missing; payment confirmation was not sent.";
    console.error("[Payment] Confirmation email failed", { paymentId, recipient: "[missing]", error });
    return { ok: false, error };
  }

  const plan = String(purchaseData.plan || "Subscription");
  const amount = formatPaymentAmount(purchaseData.amount);
  const customerName = String(purchaseData.name || "Customer");
  const activationNote = activated
    ? "Your subscription has been activated."
    : "Your payment was received and is being finalized by our team.";

  try {
    const result = await sendEmail({
      to: `"${customerName}" <${recipient}>`,
      subject: "Payment Confirmation - Vconstech ERP",
      html: `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
          <h2>Payment received</h2>
          <p>Thank you, ${escapeHtml(customerName)}. ${escapeHtml(activationNote)}</p>
          <table style="border-collapse: collapse;">
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Plan</td><td style="padding: 6px 0;">${escapeHtml(plan)}</td></tr>
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Amount paid</td><td style="padding: 6px 0;">${escapeHtml(amount)}</td></tr>
            <tr><td style="padding: 6px 12px 6px 0; font-weight: 700;">Payment ID</td><td style="padding: 6px 0;">${escapeHtml(paymentId)}</td></tr>
          </table>
        </div>`,
      text: [
        `Thank you, ${customerName}. ${activationNote}`,
        `Plan: ${plan}`,
        `Amount paid: ${amount}`,
        `Payment ID: ${paymentId}`,
      ].join("\n"),
    });

    console.info("[Payment] Confirmation email result", {
      provider: "Brevo",
      paymentId,
      recipient: redactEmail(recipient),
      accepted: result.ok,
      status: result.status ?? null,
      messageId: result.messageId ?? null,
      error: result.error ?? null,
    });

    return result;
  } catch (error) {
    console.error("[Payment] Confirmation email failed", {
      provider: "Brevo",
      paymentId,
      recipient: redactEmail(recipient),
      error: error?.message,
    });
    return { ok: false, error: error?.message || "Unable to send payment confirmation email." };
  }
};

const getCrmCustomer = (responseData) => {
  if (Array.isArray(responseData)) return responseData[0] || null;

  const data = responseData?.data ?? responseData;
  if (Array.isArray(data)) return data[0] || null;

  return data?.customer || data?.user || data || null;
};

// The CRM customer lookup is the source of truth for website registrations.
// Keep this check server-side so callers cannot create an order by skipping the UI.
const findDuplicateRegistration = async ({ customer = {}, pricingCustomer = {} }) => {
  const email = normalizeRegistrationValue(customer.email);

  if (!email) {
    const error = new Error("Email is required to validate registration.");
    error.statusCode = 400;
    throw error;
  }

  if (!env.duplicateRegistrationApiBaseUrl) {
    const error = new Error("Duplicate registration API base URL is not configured");
    error.statusCode = 502;
    throw error;
  }

  const query = new URLSearchParams({
    email,
    customerId: pricingCustomer.customerId || pricingCustomer.crmCustomerId || pricingCustomer.erpCustomerId || "",
    crmCustomerId: pricingCustomer.crmCustomerId || "",
    erpCustomerId: pricingCustomer.erpCustomerId || "",
    userId: pricingCustomer.userId || "",
  });

  const lookupUrl = `${env.duplicateRegistrationApiBaseUrl}${env.crmDuplicateRegistrationPath}?${query.toString()}`;
  const response = await fetch(lookupUrl);
  const responseText = await response.text();
  let data = {};

  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      const error = new Error("Duplicate registration lookup returned an invalid response.");
      error.statusCode = 502;
      throw error;
    }
  }
  const lookupCustomer = getCrmCustomer(data);
  console.info("[Payment] Duplicate registration CRM response", {
    lookupUrl: lookupUrl.replace(/([?&]email=)[^&]*/i, "$1[redacted]"),
    status: response.status,
    ok: response.ok,
    requestedEmail: redactEmail(email),
    responseSuccess: data?.success ?? null,
    responseError: data?.error || data?.message || null,
    customerFound: Boolean(lookupCustomer),
    accountStatus: lookupCustomer?.accountStatus ?? null,
    subscriptionStatus: lookupCustomer?.subscriptionStatus ?? null,
  });

  const routeIsMissing = response.status === 404 && /api route not found|cannot get/i.test(
    String(data?.error || data?.message || responseText || "")
  );

  // A missing customer is valid; the caller may continue with payment.
  if (response.status === 404 && !routeIsMissing) {
    console.info("[Payment] Duplicate registration comparison", {
      requestedEmail: redactEmail(email),
      existingEmail: "",
      existingCompanyName: "",
      accountStatus: null,
      package: null,
      subscriptionStatus: null,
      identityMatches: false,
      activePaidAccount: false,
      activeSubscription: false,
      duplicateReason: "customer_not_found",
      duplicate: false,
    });
    return { duplicate: false };
  }

  if (!response.ok) {
    // A missing *customer* is valid. A missing lookup route/configuration is not:
    // block checkout rather than treating an unavailable validation service as available.
    const error = new Error(data?.message || data?.error || "Unable to validate existing registration.");
    error.statusCode = routeIsMissing ? 502 : response.status;
    throw error;
  }

  const existingCustomer = lookupCustomer;
  const existingEmail = normalizeRegistrationValue(existingCustomer?.email);
  const identityMatches = existingEmail === email;
  const packageValue = existingCustomer?.package || existingCustomer?.subscriptionPlan;
  const activePaidAccount = hasActivePaidAccount(existingCustomer?.accountStatus, packageValue);
  const activeSubscription = hasActiveSubscription(existingCustomer);
  const duplicate = identityMatches && (activePaidAccount || activeSubscription);
  const duplicateReason = !identityMatches
    ? "email_mismatch"
    : activePaidAccount
      ? "active_account_with_paid_package"
      : activeSubscription
        ? "subscription_status_active"
        : "no_active_subscription";

  console.info("[Payment] Duplicate registration comparison", {
    requestedEmail: redactEmail(email),
    existingEmail: redactEmail(existingEmail),
    accountStatus: existingCustomer?.accountStatus ?? null,
    package: packageValue ?? null,
    subscriptionStatus: existingCustomer?.subscriptionStatus ?? null,
    identityMatches,
    activePaidAccount,
    activeSubscription,
    duplicateReason,
    duplicate,
  });

  return { duplicate, existingCustomer: duplicate ? existingCustomer : null };
};

const getRazorpayClient = () => {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    const error = new Error("Payment gateway is not configured.");
    error.statusCode = 503;
    throw error;
  }

  return new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret,
  });
};

const findPlanById = (plans, planId) =>
  plans.find((plan) => String(plan?.id || "") === String(planId || ""));

const calculatePayableAmount = (plan, customMembers) => {
  const baseAmount = isAdvancedPlan(plan?.name)
    ? Number(customMembers || 0) * 1000
    : Number(String(plan?.price || 0).replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
    throw new Error("Invalid payable amount");
  }

  const tax = Math.round(baseAmount * 0.18);
  const total = baseAmount + tax;

  return {
    baseAmount,
    tax,
    total,
    amountInPaise: total * 100,
  };
};

const normalizeRazorpayError = (error) => {
  const gatewayError = error?.error || {};
  const description = gatewayError.description || error?.message || "";
  const statusCode = Number(error?.statusCode || error?.status || gatewayError.statusCode);
  const isAuthError = statusCode === 401 || /authentication failed/i.test(description);

  const normalized = new Error(
    isAuthError
      ? "Payment gateway authentication failed. Please check Razorpay key settings."
      : gatewayError.description || "Unable to create payment order with the payment gateway."
  );

  normalized.statusCode = isAuthError ? 503 : 502;
  normalized.cause = error;
  return normalized;
};

const createPaymentOrder = async ({ planId, billingCycle, customer = {}, customMembers, purchaseFlow, pricingCustomer = {} }) => {
  const registrationCheck = await findDuplicateRegistration({ customer, pricingCustomer });
  if (registrationCheck.duplicate) {
    const error = new Error("A user with this email and company is already registered.");
    error.statusCode = 409;
    throw error;
  }

  const plans = await fetchPlansFromCrm();
  const plan = Array.isArray(plans) ? findPlanById(plans, planId) : null;

  if (!plan) {
    const error = new Error("Selected plan was not found");
    error.statusCode = 404;
    throw error;
  }

  const amount = calculatePayableAmount(plan, customMembers);
  const razorpay = getRazorpayClient();

  let order;

  try {
    order = await razorpay.orders.create({
      amount: amount.amountInPaise,
      currency: "INR",
      receipt: `vconstech_${Date.now()}`,
      notes: {
        planId: String(plan.id || ""),
        planName: String(plan.name || ""),
        billingCycle: String(billingCycle || plan.duration || ""),
        purchaseFlow: String(purchaseFlow || ""),
        customerName: String(customer.name || ""),
        customerEmail: String(customer.email || ""),
        customerPhone: String(customer.phone || ""),
      },
    });
  } catch (error) {
    throw normalizeRazorpayError(error);
  }

  return {
    order,
    plan: {
      id: plan.id,
      name: plan.name,
      duration: plan.duration || billingCycle || "",
    },
    amount,
    razorpayKeyId: env.razorpayKeyId,
    customer,
    customMembers,
    purchaseFlow,
    pricingCustomer,
  };
};

const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return generatedSignature === razorpay_signature;
};

const activateCrmPurchase = async ({ paymentId, purchaseData = {} }) => {
  if (!env.purchaseActivationApiBaseUrl) {
    throw new Error("Purchase activation API base URL is not configured");
  }

  const controller = new AbortController();
  const timeoutMs = Number.isFinite(env.crmRequestTimeoutMs) && env.crmRequestTimeoutMs > 0
    ? env.crmRequestTimeoutMs
    : 20000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;

  try {
    response = await fetch(`${env.purchaseActivationApiBaseUrl}/subscription-sync/pricing/purchase-success`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        purchaseFlow: purchaseData.purchaseFlow,
        userId: purchaseData.userId,
        customerId: purchaseData.customerId,
        crmCustomerId: purchaseData.crmCustomerId,
        erpCustomerId: purchaseData.erpCustomerId,
        name: purchaseData.name,
        companyName: purchaseData.companyName,
        email: purchaseData.email,
        phone: purchaseData.phone,
        plan: purchaseData.plan,
        paymentId,
      }),
    });
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("CRM purchase activation timed out");
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || "CRM purchase activation failed");
  }

  return data;
};

const verifyAndActivatePayment = async (payload) => {
  const isValidSignature = verifyPaymentSignature(payload);

  if (!isValidSignature) {
    const error = new Error("Invalid payment signature");
    error.statusCode = 400;
    throw error;
  }

  let activated = false;
  let activationError;
  let crmResponse;

  try {
    crmResponse = await activateCrmPurchase({
      paymentId: payload.razorpay_payment_id,
      purchaseData: payload.purchaseData,
    });
    activated = true;
  } catch (error) {
    console.error("Payment verified but CRM purchase activation failed:", error);
    activationError = error.message || "CRM purchase activation failed";
  }

  const confirmationEmail = await sendPaymentConfirmationEmail({
    paymentId: payload.razorpay_payment_id,
    purchaseData: payload.purchaseData,
    activated,
  });

  return {
    verified: true,
    activated,
    activationError,
    crmResponse,
    confirmationEmail: {
      sent: confirmationEmail.ok,
      messageId: confirmationEmail.messageId || null,
      error: confirmationEmail.error || null,
    },
  };
};

module.exports = {
  createPaymentOrder,
  findDuplicateRegistration,
  verifyAndActivatePayment,
  calculatePayableAmount,
  verifyPaymentSignature,
};
