const { successResponse } = require("../utils/apiResponse");

const getHealth = (req, res) => {
  return res.status(200).json(
    successResponse("Vconstech backend is healthy", {
      service: "vconstech-website-backend",
      status: "ok",
    })
  );
};

module.exports = { getHealth };
