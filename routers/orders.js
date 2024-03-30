const express = require("express");
const router = express.Router();

const { Users } = require("../modals/users");

router.get(`/:id`, async (req, resp) => {
  const user = await Users.findById(req.params.id).populate("orderIds");

  const result = user.orderIds;
  resp.status(200).send(result);
});

module.exports = router;
