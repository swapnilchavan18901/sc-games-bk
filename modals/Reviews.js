const mongoose = require("mongoose");

const ReviewsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  rated: {
    type: Number,
    required: true,
  },
});

ReviewsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

ReviewsSchema.set("toJSON", {
  virtuals: true,
});

exports.Reviews = mongoose.model("Reviews", ReviewsSchema);
