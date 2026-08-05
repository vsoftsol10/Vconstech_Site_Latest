const { env } = require("../config/env");
const { sendMail } = require("../config/mail");

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatMessageSummary = (requirements = "") => {
  const normalized = String(requirements).trim().replace(/\s+/g, " ");
  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
};

const buildAdminNotificationHtml = (contact) => `
  <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
    <h2 style="color: #111827;">New Vconstech ERP Demo Request</h2>
    <p>A new contact form submission was received from the Vconstech website.</p>
    <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
      <tr><td style="padding: 8px; font-weight: 700;">Customer Name</td><td style="padding: 8px;">${escapeHtml(contact.fullName)}</td></tr>
      <tr><td style="padding: 8px; font-weight: 700;">Company Name</td><td style="padding: 8px;">${escapeHtml(contact.company)}</td></tr>
      <tr><td style="padding: 8px; font-weight: 700;">Phone</td><td style="padding: 8px;">${escapeHtml(contact.phone)}</td></tr>
      <tr><td style="padding: 8px; font-weight: 700;">Email</td><td style="padding: 8px;">${escapeHtml(contact.email)}</td></tr>
      <tr><td style="padding: 8px; font-weight: 700;">Location</td><td style="padding: 8px;">${escapeHtml(contact.location || "Not provided")}</td></tr>
      <tr><td style="padding: 8px; font-weight: 700;">Address</td><td style="padding: 8px;">${escapeHtml(contact.address || "Not provided")}</td></tr>
      <tr><td style="padding: 8px; font-weight: 700;">Submission Date & Time</td><td style="padding: 8px;">${escapeHtml(contact.submissionTime)}</td></tr>
    </table>
    <h3 style="margin-top: 24px;">Requirements</h3>
    <p style="white-space: pre-line; background: #f9fafb; border-left: 4px solid #ffbe01; padding: 12px;">${escapeHtml(contact.requirements || "Not provided")}</p>
  </div>
`;

const buildCustomerAutoReplyHtml = (contact) => `
  <div style="margin: 0; padding: 0; background: #f5f7fb; font-family: Arial, sans-serif; color: #111827;">
    <div style="max-width: 640px; margin: 0 auto; background: #ffffff;">
      <div style="background: #111827; padding: 28px 32px; border-bottom: 4px solid #ffbe01;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Vconstech ERP</h1>
        <p style="margin: 8px 0 0; color: #facc15;">Construction ERP Demo Request Received</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="margin: 0 0 16px; color: #111827;">Thank you, ${escapeHtml(contact.fullName)}.</h2>
        <p style="font-size: 16px; line-height: 1.7;">
          We have received your Vconstech ERP demo request. Our ERP team will contact you within 24 hours.
        </p>
        <div style="margin: 24px 0; padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px;"><strong>Customer Name:</strong> ${escapeHtml(contact.fullName)}</p>
          <p style="margin: 0 0 10px;"><strong>Demo Request:</strong> Received</p>
          <p style="margin: 0;"><strong>Project Requirements:</strong> ${escapeHtml(formatMessageSummary(contact.requirements || "Demo request received from website contact form."))}</p>
        </div>
        <div style="margin: 24px 0; padding: 20px; background: #111827; color: #ffffff; border-left: 4px solid #ffbe01;">
          <h3 style="margin: 0 0 14px; color: #ffffff; font-size: 18px;">What happens next?</h3>
          <p style="margin: 0 0 10px; color: #f9fafb;">&#10004; Our ERP specialists will review your demo request.</p>
          <p style="margin: 0 0 10px; color: #f9fafb;">&#10004; We will contact you within 24 hours to schedule your demo.</p>
          <p style="margin: 0 0 10px; color: #f9fafb;">&#10004; A personalized live ERP demonstration will be arranged based on your business requirements.</p>
          <p style="margin: 0 0 10px; color: #f9fafb;">&#10004; Our experts will explain Project Management, Material Management, Labour Management, Financial Management, Contract Management, and other ERP modules.</p>
          <p style="margin: 0; color: #f9fafb;">&#10004; You will have the opportunity to ask questions and receive a customized solution for your construction business.</p>
        </div>
        <a href="${escapeHtml(env.websiteUrl)}" style="display: inline-block; background: #ffbe01; color: #111827; padding: 12px 20px; text-decoration: none; font-weight: 700; border-radius: 6px;">
          Visit Vconstech Website
        </a>
      </div>
      <div style="padding: 20px 32px; background: #111827; color: #d1d5db; font-size: 13px; line-height: 1.6;">
        <p style="margin: 0 0 8px;">Vconstech ERP helps construction businesses manage projects, materials, labour, finance, contracts, and reporting in one platform.</p>
        <p style="margin: 0;">This is an automated confirmation email from Vconstech ERP.</p>
      </div>
    </div>
  </div>
`;

const sendContactEmails = async (contact) => {
  const adminEmail = sendMail({
    to: env.adminEmail,
    replyTo: `"${contact.fullName}" <${contact.email}>`,
    subject: "New Vconstech ERP Demo Request - Website Demo",
    html: buildAdminNotificationHtml(contact),
    text: [
      "New Vconstech ERP Demo Request",
      `Customer Name: ${contact.fullName}`,
      `Company Name: ${contact.company}`,
      `Phone: ${contact.phone}`,
      `Email: ${contact.email}`,
      `Location: ${contact.location || "Not provided"}`,
      `Address: ${contact.address || "Not provided"}`,
      `Requirements: ${contact.requirements || "Not provided"}`,
      `Submission Date & Time: ${contact.submissionTime}`,
    ].join("\n"),
  });

  const customerEmail = sendMail({
    to: `"${contact.fullName}" <${contact.email}>`,
    subject: "Demo Request Received - Vconstech ERP",
    html: buildCustomerAutoReplyHtml(contact),
    text: [
      `Thank you, ${contact.fullName}.`,
      "Demo Request Received",
      `Project Requirements: ${formatMessageSummary(contact.requirements || "Demo request received from website contact form.")}`,
      "What happens next?",
      "Our ERP specialists will review your demo request.",
      "We will contact you within 24 hours to schedule your demo.",
      "A personalized live ERP demonstration will be arranged based on your business requirements.",
      "Our experts will explain Project Management, Material Management, Labour Management, Financial Management, Contract Management, and other ERP modules.",
      "You will have the opportunity to ask questions and receive a customized solution for your construction business.",
      "Our ERP team will contact you within 24 hours.",
      `Website: ${env.websiteUrl}`,
    ].join("\n"),
  });

  return Promise.all([adminEmail, customerEmail]);
};

module.exports = { sendContactEmails };
