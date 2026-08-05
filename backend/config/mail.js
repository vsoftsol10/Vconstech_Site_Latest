const nodemailer = require("nodemailer");

const isSecureSmtp = (value, port) =>
  value === "true" || value === "1" || Number(port || 587) === 465;

const mailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: isSecureSmtp(process.env.SMTP_SECURE, process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const transporter =
  mailConfig.host && mailConfig.auth.user && mailConfig.auth.pass
    ? nodemailer.createTransport(mailConfig)
    : null;

const verifyTransporter = async () => {
  if (!transporter) {
    throw new Error(
      "Email transporter not initialized. Check SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL, and SMTP_FROM_NAME."
    );
  }

  await transporter.verify();
  return transporter;
};

const getFromAddress = () => {
  const fromEmail = process.env.SMTP_FROM_EMAIL || mailConfig.auth.user;
  const fromName = process.env.SMTP_FROM_NAME || "Vconstech ERP";

  return fromName ? `"${fromName}" <${fromEmail}>` : fromEmail;
};

const sendMail = async (mailOptions) => {
  const transporterInstance = await verifyTransporter();

  return transporterInstance.sendMail({
    from: getFromAddress(),
    ...mailOptions,
  });
};

module.exports = {
  transporter,
  verifyTransporter,
  sendMail,
};
