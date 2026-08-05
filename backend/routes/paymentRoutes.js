const express = require("express");
const { submitPayment, createOrder, verifyPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/", submitPayment);
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;
