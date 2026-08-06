const nodemailer = require("nodemailer");

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

const transporter =
  mailConfig.host &&
  mailConfig.auth.user &&
  mailConfig.auth.pass
    ? nodemailer.createTransport(mailConfig)
    : null;

const verifyTransporter = async () => {
  if (!transporter) {
    throw new Error(
      "SMTP transporter is not configured. Check SMTP environment variables."
    );
  }

  await transporter.verify();

  console.log("✅ Brevo SMTP Connected");

  return transporter;
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

  return transporter.sendMail({
    from: getFromAddress(),
    ...mailOptions,
  });
};

module.exports = {
  transporter,
  verifyTransporter,
  sendMail,
};