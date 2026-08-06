const nodemailer = require("nodemailer");

const maskValue = (value) => {
  if (!value) return "[missing]";

  const stringValue = String(value);
  if (stringValue.length <= 4) return "[set]";

  return `${stringValue.slice(0, 2)}***${stringValue.slice(-2)}`;
};

const isSecureSmtp = (value, port) =>
  value === "true" ||
  value === "1" ||
  Number(port || 587) === 465;

const mailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: isSecureSmtp(process.env.SMTP_SECURE, process.env.SMTP_PORT),

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // Better compatibility for Render/Brevo
  requireTLS: true,

  tls: {
    rejectUnauthorized: false,
  },

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
};

const smtpDiagnostics = {
  SMTP_HOST: mailConfig.host || "[missing]",
  SMTP_PORT: mailConfig.port,
  SMTP_SECURE: mailConfig.secure,
  SMTP_USER: maskValue(mailConfig.auth.user),
  SMTP_PASS: mailConfig.auth.pass ? "[set]" : "[missing]",
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || mailConfig.auth.user || "[missing]",
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || "Vconstech ERP",
};

const getSmtpFailurePoint = (error) => {
  if (error?.code === "EAUTH" || error?.responseCode === 535) {
    return "SMTP Authentication";
  }

  if (
    error?.code === "ETIMEDOUT" ||
    error?.code === "ESOCKET" ||
    error?.code === "ECONNECTION" ||
    error?.code === "EDNS" ||
    error?.command === "CONN"
  ) {
    return "SMTP Connection";
  }

  return "SMTP Unknown";
};

const buildSmtpErrorLog = (error) => ({
  failurePoint: getSmtpFailurePoint(error),
  message: error?.message,
  code: error?.code,
  name: error?.name,
  stack: error?.stack,
  cause: error?.cause,
  command: error?.command,
  response: error?.response,
  responseCode: error?.responseCode,
  errno: error?.errno,
  syscall: error?.syscall,
  address: error?.address,
  port: error?.port,
});

const transporter =
  mailConfig.host &&
  mailConfig.auth.user &&
  mailConfig.auth.pass
    ? nodemailer.createTransport(mailConfig)
    : null;

const verifyTransporter = async () => {
  const startedAt = Date.now();

  console.log("[smtp] SMTP connection verification started", smtpDiagnostics);

  if (!transporter) {
    const error = new Error(
      "SMTP transporter is not configured. Check SMTP environment variables."
    );

    console.error("[smtp] SMTP connection verification failed", {
      duration: `${Date.now() - startedAt} ms`,
      ...buildSmtpErrorLog(error),
    });

    throw error;
  }

  try {
    await transporter.verify();

    console.log("[smtp] SMTP connection verification completed", {
      duration: `${Date.now() - startedAt} ms`,
      response: "SMTP transporter verified successfully",
    });

    return transporter;
  } catch (error) {
    console.error("[smtp] SMTP connection verification failed", {
      duration: `${Date.now() - startedAt} ms`,
      ...buildSmtpErrorLog(error),
    });
    throw error;
  }
};

const getFromAddress = () => {
  const fromEmail =
    process.env.SMTP_FROM_EMAIL || mailConfig.auth.user;

  const fromName =
    process.env.SMTP_FROM_NAME || "Vconstech ERP";

  return `"${fromName}" <${fromEmail}>`;
};

const sendMail = async (mailOptions) => {
  if (!transporter) {
    throw new Error("SMTP transporter not initialized.");
  }

  const startedAt = Date.now();

  try {
    const result = await transporter.sendMail({
      from: getFromAddress(),
      ...mailOptions,
    });

    console.log("[smtp] SMTP response", {
      duration: `${Date.now() - startedAt} ms`,
      to: mailOptions.to,
      messageId: result?.messageId,
      response: result?.response,
      accepted: result?.accepted,
      rejected: result?.rejected,
      envelope: result?.envelope,
    });

    return result;
  } catch (error) {
    console.error("[smtp] SMTP send failed", {
      duration: `${Date.now() - startedAt} ms`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      ...buildSmtpErrorLog(error),
    });
    throw error;
  }
};

module.exports = {
  transporter,
  verifyTransporter,
  sendMail,
  getSmtpFailurePoint,
};
