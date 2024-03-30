const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema({
  razorpay_payment_id: {
    type: String,
    required: true,
  },

  totalAmount: {
    type: String,
    required: true,
  },
});

PaymentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

PaymentSchema.set("toJSON", {
  virtuals: true,
});

exports.Payment = mongoose.model("Payments", PaymentSchema);

/**
Order Example:

{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress1" : "Flowers Street , 45",
    "shippingAddress2" : "1-B",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic",
    "phone": "+420702241333",
    "user": "5fd51bc7e39ba856244a3b44"
}

 */
