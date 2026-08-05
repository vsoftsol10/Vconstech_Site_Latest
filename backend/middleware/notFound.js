const { errorResponse } = require("../utils/apiResponse");

const notFound = (req, res) => {
  return res.status(404).json(errorResponse(`Route not found: ${req.originalUrl}`));
};

module.exports = { notFound };
