const { fetchPricingPlans } = require("../services/plansService");

const getPlans = async (req, res) => {
  try {
    const plans = await fetchPricingPlans();
    return res.status(200).json(plans);
  } catch (error) {
    return res.status(error.statusCode || 502).json({
      success: false,
      message: "Unable to fetch pricing plans.",
    });
  }
};

module.exports = { getPlans };
