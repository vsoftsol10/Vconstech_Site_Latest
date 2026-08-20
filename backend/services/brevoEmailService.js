const BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

const parseEmailAddress = (address) => {
  const value = String(address || "").trim();
  const match = value.match(/^"?([^"<]*)"?\s*<([^>]+)>$/);

  if (!match) {
    return { email: value };
  }

  const name = match[1].trim();
  const email = match[2].trim();

  return name ? { email, name } : { email };
};

const getSender = () => ({
  email: process.env.SMTP_FROM_EMAIL,
  name: process.env.SMTP_FROM_NAME || "Vconstech ERP",
});

const buildBrevoPayload = (options) => {
  const payload = {
    sender: getSender(),
    to: [parseEmailAddress(options.to)],
    subject: options.subject,
    htmlContent: options.html,
    textContent: options.text,
  };

  if (options.replyTo) {
    payload.replyTo = parseEmailAddress(options.replyTo);
  }

  return payload;
};

const getResponseHeaders = (headers) =>
  Object.fromEntries(headers.entries());

const getBrevoErrorMessage = (responseBody, fallback) => {
  if (responseBody && typeof responseBody === "object") {
    return responseBody.message || responseBody.error || fallback;
  }

  return responseBody || fallback;
};

const logBrevoInfo = (message, details) => {
  console.log(`[brevo] ${message}`, details);
};

const logBrevoError = (message, details) => {
  console.error(`[brevo] ${message}`, details);
};

const sendEmail = async (options) => {
  const startedAt = Date.now();

  if (!process.env.BREVO_API_KEY) {
    const message = "BREVO_API_KEY is not configured.";

    logBrevoError("Brevo email failed", {
      duration: `${Date.now() - startedAt} ms`,
      to: options.to,
      subject: options.subject,
      message,
    });

    return { ok: false, status: null, body: null, error: message };
  }

  try {
    const payload = buildBrevoPayload(options);
    const requestDetails = {
      url: BREVO_EMAIL_URL,
      method: "POST",
      headers: {
        "api-key": "[REDACTED]",
        "Content-Type": "application/json",
      },
      body: payload,
    };

    logBrevoInfo("Brevo API request", requestDetails);

    const response = await fetch(BREVO_EMAIL_URL, {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let responseBody = responseText;

    try {
      responseBody = responseText ? JSON.parse(responseText) : null;
    } catch (_) {
      responseBody = responseText;
    }

    const responseDetails = {
      duration: `${Date.now() - startedAt} ms`,
      status: response.status,
      statusText: response.statusText,
      headers: getResponseHeaders(response.headers),
      body: responseBody,
    };

    logBrevoInfo("Brevo API response", responseDetails);

    if (!response.ok) {
      const errorMessage = getBrevoErrorMessage(responseBody, response.statusText);

      logBrevoError("Brevo API returned an error", {
        duration: `${Date.now() - startedAt} ms`,
        to: options.to,
        subject: options.subject,
        status: response.status,
        headers: getResponseHeaders(response.headers),
        body: responseBody,
        errorBody: responseBody,
        message: errorMessage,
      });

      return {
        ok: false,
        status: response.status,
        body: responseBody,
        error: errorMessage,
      };
    }

    return {
      ok: true,
      status: response.status,
      body: responseBody,
      messageId: responseBody?.messageId,
      response: responseBody,
    };
  } catch (error) {
    logBrevoError("Brevo email request failed", {
      duration: `${Date.now() - startedAt} ms`,
      to: options.to,
      subject: options.subject,
      status: null,
      body: null,
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack,
      cause: error?.cause,
    });

    return {
      ok: false,
      status: null,
      body: null,
      error: error?.message,
    };
  }
};

module.exports = { sendEmail };
