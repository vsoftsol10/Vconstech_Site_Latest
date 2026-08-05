const { env } = require("../config/env");

const createWebsiteDemoLeadPayload = (contact) => ({
  fullName: contact.fullName,
  company: contact.company,
  phone: contact.phone,
  email: contact.email,
  location: contact.location || "",
  address: contact.address || "",
  requirements: contact.requirements || "",
  status: "new",
  channel: "Website Demo",
  date: new Date().toISOString().slice(0, 10),
});

const parseCrmResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return {
      success: false,
      message: text,
    };
  }
};

const createWebsiteDemoLead = async (contact) => {
  if (!env.crmApiBaseUrl) {
    const error = new Error("CRM_API_BASE_URL is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const payload = createWebsiteDemoLeadPayload(contact);
  const response = await fetch(`${env.crmApiBaseUrl}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseCrmResponse(response);

  return {
    ok: response.ok,
    status: response.status,
    data,
    payload,
  };
};

module.exports = {
  createWebsiteDemoLead,
  createWebsiteDemoLeadPayload,
};
