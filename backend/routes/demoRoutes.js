const express = require("express");
const { submitDemo } = require("../controllers/demoController");

const router = express.Router();

router.post("/", submitDemo);

module.exports = router;
