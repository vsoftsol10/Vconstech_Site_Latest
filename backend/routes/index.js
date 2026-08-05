const express = require("express");

const healthRoutes = require("./healthRoutes");
const contactRoutes = require("./contactRoutes");
const demoRoutes = require("./demoRoutes");
const paymentRoutes = require("./paymentRoutes");
const plansRoutes = require("./plansRoutes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/contact", contactRoutes);
router.use("/demo", demoRoutes);
router.use("/payment", paymentRoutes);
router.use("/plans", plansRoutes);

module.exports = router;
