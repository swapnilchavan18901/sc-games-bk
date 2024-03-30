const express = require("express");
const router = express.Router();
const { Category } = require("../modals/category");
router.get(`/`, async (req, resp) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    resp.status(500).json({ sucess: false });
  }
  resp.status(200).send(categoryList);
});

router.get(`/:id`, async (req, resp) => {
  const categoryList = await Category.findById(req.params.id);

  if (!categoryList) {
    resp
      .status(500)
      .json({ message: "The category with the given ID was not found." });
  }
  resp.status(200).send(categoryList);
});

router.put(`/:id`, async (req, resp) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );

  if (!category) {
    resp.status(500).json({ sucess: false });
  }
  resp.status(200).send(category);
});

router.post(`/`, async (req, resp) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();
  if (!category) return resp.status(404).send("category cannot be created");

  resp.send(category);
});

router.delete(`/:id`, async (req, resp) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        resp.status(200).json({ sucess: true, message: "category is deleted" });
      } else {
        resp.status(404).json({ sucess: false, message: "category not found" });
      }
    })
    .catch((e) => {
      return resp.status(400).json({ sucess: false, error: e });
    });
});

module.exports = router;
