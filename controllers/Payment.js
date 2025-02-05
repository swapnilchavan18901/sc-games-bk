const errorHandler = require("../helpers/errorhandler");
const Razorpay = require("razorpay");
const crypto = require("crypto");

exports.sendRazorpayKey = async (req, res, next) => {
  res.status(200).json({
    razorpaykey: process.env.RAZORPAY_API_KEY,
  });
};

exports.captureRazorpayPayment = async (req, res, next) => {
  let instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  let options = {
    amount: req.body.amount * 100, // amount conversion from paise to rupees
    currency: "INR",
    receipt: crypto.randomBytes(20).toString("hex"),
  };
  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    amount: req.body.amount * 100,
    order: myOrder,
  });
};
