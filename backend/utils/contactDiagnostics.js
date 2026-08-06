const SENSITIVE_KEYS = new Set([
  "password",
  "pass",
  "token",
  "accesstoken",
  "access_token",
  "refreshtoken",
  "refresh_token",
  "authorization",
  "cookie",
  "secret",
  "apikey",
  "api_key",
]);

const getElapsedMs = (startedAt) => `${Date.now() - startedAt} ms`;

const sanitizeForLog = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeForLog);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((safe, [key, item]) => {
    const normalizedKey = key.toLowerCase();
    safe[key] = SENSITIVE_KEYS.has(normalizedKey) ? "[REDACTED]" : sanitizeForLog(item);
    return safe;
  }, {});
};

const serializeCause = (cause) => {
  if (!cause) return undefined;

  if (cause instanceof Error) {
    return {
      name: cause.name,
      message: cause.message,
      stack: cause.stack,
      code: cause.code,
      errno: cause.errno,
      syscall: cause.syscall,
      hostname: cause.hostname,
    };
  }

  return sanitizeForLog(cause);
};

const buildErrorLog = (error) => ({
  message: error?.message,
  stack: error?.stack,
  name: error?.name,
  code: error?.code,
  cause: serializeCause(error?.cause),
  responseStatus: error?.response?.status,
  responseData: sanitizeForLog(error?.response?.data),
  error: sanitizeForLog(error),
});

const logContactInfo = (requestId, message, details = {}) => {
  console.log(`[contact:${requestId}] ${message}`, sanitizeForLog(details));
};

const logContactError = (requestId, message, error, details = {}) => {
  console.error(`[contact:${requestId}] ${message}`, {
    ...sanitizeForLog(details),
    ...buildErrorLog(error),
  });
};

module.exports = {
  getElapsedMs,
  logContactError,
  logContactInfo,
  sanitizeForLog,
};
