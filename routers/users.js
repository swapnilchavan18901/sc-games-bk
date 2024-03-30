const express = require("express");
const router = express.Router();
const { Users } = require("../modals/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
const multiple = uploadOptions.fields([{ name: "profile", maxcount: 1 }]);
router.put(`/:id`, multiple, async (req, resp) => {
  const files = req.files;
  console.log(files);
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const user = await Users.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      profileimage: `${basePath}${files.profile[0].filename}`,
    },
    { new: true }
  ).populate("Payments");

  if (!user) {
    resp.status(500).send("Profile image did not updated !");
  }
  console.log(user);
  resp.status(200).send(user);
});
router.get(`/`, async (req, resp) => {
  const UsersList = await Users.find();

  if (!UsersList) {
    resp.status(500).json({ sucess: false });
  }
  resp.send(UsersList);
});

router.get(`/:id`, async (req, resp) => {
  const user = await Users.findById(req.params.id).select("-passwordHash ");

  if (!user) {
    resp
      .status(500)
      .json({ message: "The category with the given ID was not found." });
  }
  resp.status(200).send(user);
});
router.delete(`/:id`, async (req, resp) => {
  Users.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        resp.status(200).json({ sucess: true, message: "user is deleted" });
      } else {
        resp.status(404).json({ sucess: false, message: "user not found" });
      }
    })
    .catch((e) => {
      return resp.status(400).json({ sucess: false, error: e });
    });
});

router.get(`/get/count`, async (req, resp) => {
  const usercount = await Users.countDocuments();

  if (!usercount) {
    resp.status(500).json({ sucess: false });
  }
  resp.send({ usercount: usercount });
});

router.get(`/cart/:id`, async (req, resp) => {
  const user = await Users.findById(req.params.id).populate("cart");
  resp.send(user.cart);
});

router.post(`/cart/:id`, async (req, resp) => {
  const user = await Users.findById(req.params.id);
  user.cart.push(req.body.cartAddid);
  await user.save();
  resp.status(200).send({ message: "done" });
});

router.post("/login", async (req, resp) => {
  let user = await Users.findOne({ email: req.body.email });
  const SECRET = process.env.SECRET;

  if (!user) return resp.status(400).send("the user not found");
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      SECRET
    );
    resp.status(200).send({
      user: user.email,
      token: token,
      userId: user._id,
      userName: user.name,
    });
  } else {
    return resp.status(400).send("incorrect password");
  }
});

router.post("/register", async (req, res) => {
  let user = new Users({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.status(200).send({ message: "User Created" });
});

module.exports = router;
