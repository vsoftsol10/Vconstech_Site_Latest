const { successResponse } = require("../utils/apiResponse");
const { createPaymentOrder, findDuplicateRegistration, verifyAndActivatePayment } = require("../services/paymentService");

const submitPayment = (req, res) => {
  return res.status(200).json(
    successResponse("Payment placeholder endpoint reached", {
      received: true,
    })
  );
};

const createOrder = async (req, res, next) => {
  try {
    const result = await createPaymentOrder(req.body);

    return res.status(201).json(
      successResponse("Razorpay order created successfully", {
        order: result.order,
        plan: result.plan,
        amount: result.amount,
        razorpayKeyId: result.razorpayKeyId,
      })
    );
  } catch (error) {
    res.status(error.statusCode || 502);
    return next(error);
  }
};

const checkDuplicateRegistration = async (req, res, next) => {
  try {
    const result = await findDuplicateRegistration(req.body);

    if (result.duplicate) {
      return res.status(409).json({
        success: false,
        message: "A user with this email and company is already registered.",
        data: { duplicate: true },
      });
    }

    return res.status(200).json(
      successResponse("Registration is available", { duplicate: false })
    );
  } catch (error) {
    res.status(error.statusCode || 502);
    return next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const result = await verifyAndActivatePayment(req.body);

    return res.status(200).json(
      successResponse("Payment verified successfully", {
        verified: result.verified,
        activated: result.activated,
        activationError: result.activationError,
      })
    );
  } catch (error) {
    res.status(error.statusCode || 502);
    return next(error);
  }
};

module.exports = { submitPayment, createOrder, checkDuplicateRegistration, verifyPayment };
