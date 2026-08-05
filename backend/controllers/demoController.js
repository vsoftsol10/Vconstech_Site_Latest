const { successResponse } = require("../utils/apiResponse");

const submitDemo = (req, res) => {
  return res.status(200).json(
    successResponse("Demo placeholder endpoint reached", {
      received: true,
    })
  );
};

module.exports = { submitDemo };
