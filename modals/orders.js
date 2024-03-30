const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },

  image: [
    {
      type: String,
      default: "",
    },
  ],
  banner: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
  },

  playStation: {
    type: Boolean,
    default: false,
  },
  Xbox: {
    type: Boolean,
    default: false,
  },
  PC: {
    type: Boolean,
    default: false,
  },

  rating: {
    type: Number,
    default: 0,
  },
  gameKey: {
    type: String,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

OrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

OrderSchema.set("toJSON", {
  virtuals: true,
});

exports.Orders = mongoose.model("Orders", OrderSchema);

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
