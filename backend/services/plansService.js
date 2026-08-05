const { env } = require("../config/env");

const fetchPlansFromCrm = async () => {
  if (!env.crmApiBaseUrl) {
    const error = new Error("CRM API base URL is not configured");
    error.statusCode = 502;
    throw error;
  }

  const response = await fetch(`${env.crmApiBaseUrl}/plans`);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error("Unable to fetch pricing plans.");
    error.statusCode = 502;
    throw error;
  }

  return data;
};

module.exports = { fetchPlansFromCrm };
