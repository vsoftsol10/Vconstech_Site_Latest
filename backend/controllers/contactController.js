const { sendContactEmails } = require("../services/emailService");
const { createWebsiteDemoLead } = require("../services/leadService");

const submitContact = async (req, res, next) => {
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
    const crmResult = await createWebsiteDemoLead(contact);

    if (!crmResult.ok) {
      return res.status(crmResult.status).json(crmResult.data);
    }

    await sendContactEmails(contact);

    const duplicate = crmResult.data?.duplicate === true;

    return res.status(200).json({
      success: true,
      duplicate,
      message: "Your demo request has been received successfully.",
      leadId: crmResult.data?.leadId || crmResult.data?.lead?.id,
      data: {
        received: true,
        lead: crmResult.data?.lead,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { submitContact };
