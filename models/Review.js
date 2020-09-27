const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "add title for review"],
  },
  details: {
    type: String,
    minlength: [20, "cannot add review details in less than 20 characters"],
    required: [true, "add review details"],
  },
  rating: {
    type: Number,
    min: [1, "rating cannot be less than 1"],
    max: [5, "rating cannot be more than 5"],
    required: [true, "add rating"],
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: [true, "add restaurant id"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "add user id"],
  },
});

//  one user adds only one review for a restaurant
ReviewSchema.index({ user: 1, restaurant: 1 }, { unique: true });

module.exports = new mongoose.model("Review", ReviewSchema);
