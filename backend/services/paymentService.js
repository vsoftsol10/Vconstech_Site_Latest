const crypto = require("crypto");
const Razorpay = require("razorpay");

const { env } = require("../config/env");
const { fetchPlansFromCrm } = require("./plansService");

const normalizePlanName = (value) =>
  String(value || "").trim().toLowerCase().replace(/\s+/g, " ");

const isAdvancedPlan = (planName) => {
  const normalized = normalizePlanName(planName);
  return normalized.includes("advanced") || normalized === "advance" || normalized === "pro";
};

const normalizeRegistrationValue = (value) =>
  String(value || "").trim().toLowerCase().replace(/\s+/g, " ");

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
  const companyName = normalizeRegistrationValue(customer.companyName);

  if (!email || !companyName) {
    const error = new Error("Email and company name are required to validate registration.");
    error.statusCode = 400;
    throw error;
  }

  if (!env.crmApiBaseUrl) {
    const error = new Error("CRM API base URL is not configured");
    error.statusCode = 502;
    throw error;
  }

  const query = new URLSearchParams({
    email,
    companyName,
    customerId: pricingCustomer.customerId || pricingCustomer.crmCustomerId || pricingCustomer.erpCustomerId || "",
    crmCustomerId: pricingCustomer.crmCustomerId || "",
    erpCustomerId: pricingCustomer.erpCustomerId || "",
    userId: pricingCustomer.userId || "",
  });

  const response = await fetch(`${env.crmApiBaseUrl}${env.crmDuplicateRegistrationPath}?${query.toString()}`);

  // A missing customer is the expected "not registered" result.
  if (response.status === 404) return { duplicate: false };

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || data?.error || "Unable to validate existing registration.");
    error.statusCode = 502;
    throw error;
  }

  const existingCustomer = getCrmCustomer(data);
  const existingEmail = normalizeRegistrationValue(existingCustomer?.email);
  const existingCompany = normalizeRegistrationValue(existingCustomer?.companyName || existingCustomer?.company);
  const duplicate = existingEmail === email && existingCompany === companyName;

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
  if (!env.crmApiBaseUrl) {
    throw new Error("CRM API base URL is not configured");
  }

  const response = await fetch(`${env.crmApiBaseUrl}/subscription-sync/pricing/purchase-success`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

  const crmResponse = await activateCrmPurchase({
    paymentId: payload.razorpay_payment_id,
    purchaseData: payload.purchaseData,
  });

  return {
    verified: true,
    crmResponse,
  };
};

module.exports = {
  createPaymentOrder,
  findDuplicateRegistration,
  verifyAndActivatePayment,
  calculatePayableAmount,
  verifyPaymentSignature,
};
