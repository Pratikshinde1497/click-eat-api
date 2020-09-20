const mongoose = require("mongoose");
const GeoCoder = require("../utility/GeoCoder");

const RestraurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please, add restraurant name"],
    maxlength: [100, "name length should not be more than 100"],
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    required: [true, "please, add restraurant address"],
  },
  slug: String,
  details: {
    type: String,
    required: [true, "please, add restraurant details"],
    maxlength: [500, "address length should not be more than 100"],
  },
  phone: {
    type: String,
    maxlength: [20, "phone number cannot be more than 20 numbers"],
    required: [true, "please, enter your phone number"],
  },
  email: {
    type: String,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "enter valid email"],
    required: [true, "please, enter your email id"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "please use valid URL with http or https",
    ],
  },
  location: {
    //  GEOJSON point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  averageRating: {
    type: Number,
    min: [1, "Rating cannot be less than 1"],
    max: [5, "Rating cannot be more than 5"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  lodging: {
    type: Boolean,
    default: false,
  },
  services: {
    type: [String],
    required: true,
    enum: [
      "Dine-in",
      "Home Delivery",
      "Separate veg/non-veg sections",
      "Family Rooms",
      "Bear Bar",
      "Parking",
      "Kids Play Area",
    ],
  },
  speciality: {
    type: [String],
    required: true,
    enum: ["Veg", "Non-Veg", "Both"],
  },
  openHours: {
    type: Object,
  },
  // owner: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "User",
  //   required: [true, "please, add owner"],
  // },
});

RestraurantSchema.pre("save", async function (next) {
  const loc = await GeoCoder.geocode(this.address);
  if (loc.length !== 0) {
    this.location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      state: loc[0].state,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode,
      city: loc[0].city,
    };
    this.address = undefined;
  }
  next();
});

module.exports = new mongoose.model("Restaurant", RestraurantSchema);
