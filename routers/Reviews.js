const express = require("express");
const router = express.Router();
const { Reviews } = require("../modals/Reviews");
const mongoose = require("mongoose");
const { Products } = require("../modals/products");
router.post(`/:id`, async (req, resp) => {
  const product = await Products.findById(req.params.id).populate("reviews");
  if (!product) {
    resp.status(500).json({ sucess: false });
  }
  let Review = new Reviews({
    name: req.body.name,
    message: req.body.message,
    rated: req.body.rated,
  });
  product.rating = product.rating + req.body.rated;
  Review = await Review.save();
  if (!Review) {
    resp.status(500).send({ message: "Reviews not created" });
  }

  product.reviews.push(Review._id);
  await product.save();

  // resp.status(200).send({ message: "Review Added" });
  resp.status(200).send(product);
});
module.exports = router;
router.get(`/:id`, async (req, resp) => {
  const product = await Products.findById(req.params.id).populate("reviews");
  resp.send(product.reviews);
});
