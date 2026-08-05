const successResponse = (message, data = null) => ({
  success: true,
  message,
  data,
});

const errorResponse = (message, details = null) => ({
  success: false,
  message,
  details,
});

module.exports = {
  successResponse,
  errorResponse,
};
