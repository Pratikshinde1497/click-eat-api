const Restaurant = require("../models/Restraurant");

//  @desc       Get all restaurants
//  @route      GET /api/v1/restraurants
//  @access     Public
exports.getAllRestaurants = async (req, res, next) => {
  const restraurants = await Restaurant.find();
  res.json({
    success: true,
    count: restraurants.length,
    data: restraurants,
  });
};

//  @desc       Get restaurant
//  @route      GET /api/v1/restraurants/:id
//  @access     Public
exports.getRestaurant = async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new Error("no restaurant found"));
  }
  res.status(200).json({
    success: true,
    data: restaurant,
  });
};

//  @desc       Add new restaurant
//  @route      POST /api/v1/restraurants
//  @access     Private
exports.addRestaurant = async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({
    success: true,
    data: restaurant,
  });
};

//  @desc       Update restaurant
//  @route      PUT /api/v1/restraurants/:id
//  @access     Private
exports.updateRestaurant = async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new Error("no restaurant found"));
  }
  const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidation: true,
  });
  res.status(200).json({
    success: true,
    data: updated,
  });
};

//  @desc       Delete restaurant
//  @route      Delete /api/v1/restraurants/:id
//  @access     Private
exports.deleteRestaurant = async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new Error("no restaurant found"));
  }
  await Restaurant.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
};
