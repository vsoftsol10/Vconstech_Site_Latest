const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\d{10}$/.test(phone);

const validateContactPayload = (payload = {}) => {
  const errors = {};
  const data = {
    name: String(payload.name || "").trim(),
    email: String(payload.email || "").trim(),
    company: String(payload.company || "").trim(),
    phone: String(payload.phone || "").trim(),
    subject: String(payload.subject || "").trim(),
    message: String(payload.message || "").trim(),
  };

  if (!data.name) errors.name = "Name is required";
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.phone) {
    errors.phone = "Phone is required";
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "Phone number must be exactly 10 digits";
  }

  if (!data.subject) errors.subject = "Subject is required";
  if (!data.message) errors.message = "Message is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data,
  };
};

module.exports = { validateContactPayload };
