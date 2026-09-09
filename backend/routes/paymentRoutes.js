const express = require("express");
const { submitPayment, createOrder, checkDuplicateRegistration, verifyPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/", submitPayment);
router.post("/create-order", createOrder);
router.post("/check-duplicate-registration", checkDuplicateRegistration);
router.post("/verify", verifyPayment);

module.exports = router;
