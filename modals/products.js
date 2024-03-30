const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
    required: true,
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

  gameKeys: [
    {
      type: String,
    },
  ],

  dateCreated: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

exports.Products = mongoose.model("Product", productSchema);
