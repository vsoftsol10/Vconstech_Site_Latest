const { sendContactEmails } = require("../services/emailService");
const { createWebsiteDemoLead } = require("../services/leadService");
const {
  getElapsedMs,
  logContactError,
  logContactInfo,
} = require("../utils/contactDiagnostics");

const submitContact = async (req, res, next) => {
  const requestStartedAt = Date.now();
  const requestId = `${requestStartedAt}-${Math.random().toString(36).slice(2, 8)}`;

  logContactInfo(requestId, "Incoming contact request body", req.body);

  const contact = {
    fullName: req.body.fullName,
    company: req.body.company,
    phone: req.body.phone,
    email: req.body.email,
    location: req.body.location,
    address: req.body.address,
    requirements: req.body.requirements,
    submissionTime: new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  try {
    const crmResult = await createWebsiteDemoLead(contact, { requestId });

    if (!crmResult.ok) {
      logContactInfo(requestId, "Contact submission completed with CRM error response", {
        total: getElapsedMs(requestStartedAt),
        responseStatus: crmResult.status,
        responseBody: crmResult.data,
      });
      return res.status(crmResult.status).json(crmResult.data);
    }

    const duplicate = crmResult.data?.duplicate === true;
    const responseBody = {
      success: true,
      duplicate,
      message: "Your demo request has been received successfully.",
      leadId: crmResult.data?.leadId || crmResult.data?.lead?.id,
      data: {
        received: true,
        lead: crmResult.data?.lead,
      },
    };

    logContactInfo(requestId, "Contact submission completed successfully before email sending", {
      total: getElapsedMs(requestStartedAt),
      duplicate,
      leadId: responseBody.leadId,
    });

    res.status(200).json(responseBody);

    Promise.resolve()
      .then(() => {
        logContactInfo(requestId, "Post-response email sending started", {
          duplicate,
          leadId: responseBody.leadId,
        });
        return sendContactEmails(contact, { requestId });
      })
      .then(() => {
        logContactInfo(requestId, "Post-response email sending completed", {
          total: getElapsedMs(requestStartedAt),
          duplicate,
          leadId: responseBody.leadId,
        });
      })
      .catch((error) => {
        logContactError(requestId, "Post-response email sending failed", error, {
          total: getElapsedMs(requestStartedAt),
          duplicate,
          leadId: responseBody.leadId,
        });
      });

    return undefined;
  } catch (error) {
    logContactError(requestId, "Contact submission exception", error, {
      total: getElapsedMs(requestStartedAt),
    });
    return next(error);
  }
};

module.exports = { submitContact };
