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
  verifyAndActivatePayment,
  calculatePayableAmount,
  verifyPaymentSignature,
};
