const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "please add food-item name"],
  },
  details: {
    type: String,
    required: [true, "please, add item details"],
    maxlength: [500, "address length should not be more than 500"],
  },
  slug: String,
  price: {
    type: Number,
    required: [true, "please, add price of item"],
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Number,
    default: 0,
  },
  domain: {
    type: [String],
    required: true,
    enum: ["Veg", "Non-Veg", "Mixed"],
    default: "Veg",
  },
  category: {
    type: String,
    enum: [
      "Starters",
      "Indian",
      "Mexicon",
      "Chinese",
      "Desserts",
      "Quick Bites",
      "Beverages",
      "Thalis",
      "Breakfasts",
      "Mughlai",
      "Biryani",
      "North Indian",
      "South Indian",
      "Asian",
      "Sea Food",
      "Mithai",
      "other",
    ],
  },
  rating: {
    type: Number,
    min: [1, "rating cannot be less than 1"],
    max: [5, "rating cannot be more than 5"],
  },
  photo: {
    type: String,
    default: "no-food-photo.jpeg",
  },
  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: "Restaurant",
    required: [true, "please, add restaurant id"],
  },
});

module.exports = new mongoose.model("FoodItem", FoodItemSchema);
