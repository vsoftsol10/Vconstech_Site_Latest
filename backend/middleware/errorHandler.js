const { env } = require("../config/env");
const { errorResponse } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  console.error(`[${req.method} ${req.originalUrl}]`, err);

  return res.status(statusCode).json(
    errorResponse(err.message || "Internal server error", {
      stack: env.nodeEnv === "production" ? undefined : err.stack,
    })
  );
};

module.exports = { errorHandler };
