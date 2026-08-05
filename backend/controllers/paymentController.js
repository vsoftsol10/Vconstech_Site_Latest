const { successResponse } = require("../utils/apiResponse");
const { createPaymentOrder, verifyAndActivatePayment } = require("../services/paymentService");

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
      })
    );
  } catch (error) {
    return next(error);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const result = await verifyAndActivatePayment(req.body);

    return res.status(200).json(
      successResponse("Payment verified successfully", {
        verified: result.verified,
      })
    );
  } catch (error) {
    res.status(error.statusCode || 502);
    return next(error);
  }
};

module.exports = { submitPayment, createOrder, verifyPayment };
