const express = require("express");
const router = express.Router();
const { Products } = require("../modals/products");
const { Category } = require("../modals/category");
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });
const multiple = uploadOptions.fields([
  { name: "image", maxcount: 10 },
  { name: "banner", maxcount: 1 },
]);

router.post(`/`, multiple, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files.image) {
    files.image.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }
  console.log(files.banner[0].filename);
  let keys = req.body.gameKeys.split(",");
  let product = new Products({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: imagesPaths, // "http://localhost:3000/public/upload/image-2323232"
    brand: req.body.brand,
    banner: `${basePath}${files.banner[0].filename}`,
    price: req.body.price,
    category: req.body.category,
    gameKeys: keys,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    playStation: req.body.playStation,
    Xbox: req.body.Xbox,
    PC: req.body.PC,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

router.get(`/`, async (req, resp) => {
  const productlist = await Products.find().populate("category");

  if (!productlist) {
    resp.status(500).json({ sucess: false });
  }
  resp.send(productlist);
});

router.put(`/:id`, async (req, resp) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    resp.status(400).send("Invalid Product Id");
  }
  const category = await Category.findById(req.body.category);

  if (!category) resp.status(400).send("invalid Category");

  const product = await Products.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) {
    resp.status(500).send("product cannot be updated !");
  }
  resp.status(200).send(product);
});

router.delete(`/:id`, async (req, resp) => {
  Products.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        resp.status(200).json({ sucess: true, message: "product is deleted" });
      } else {
        resp.status(404).json({ sucess: false, message: "product not found" });
      }
    })
    .catch((e) => {
      return resp.status(400).json({ sucess: false, error: e });
    });
});

router.get(`/:id`, async (req, resp) => {
  const product = await Products.findById(req.params.id).populate("reviews");

  if (!product) {
    resp.status(500).json({ sucess: false });
  }

  resp.send(product);
});

module.exports = router;
