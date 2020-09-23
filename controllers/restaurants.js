const Restaurant = require("../models/Restraurant");
const ErrorResponse = require("../utility/ErrorResponse");
const AsyncHandler = require("../middelware/Async");

//  @desc       Get all restaurants
//  @route      GET /api/v1/restraurants
//  @access     Public
exports.getAllRestaurants = AsyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResponce);
});

//  @desc       Get restaurant
//  @route      GET /api/v1/restraurants/:id
//  @access     Public
exports.getRestaurant = AsyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new ErrorResponse("no restaurant found", 404));
  }
  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

//  @desc       Add new restaurant
//  @route      POST /api/v1/restraurants
//  @access     Private
exports.addRestaurant = AsyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({
    success: true,
    data: restaurant,
  });
});

//  @desc       Update restaurant
//  @route      PUT /api/v1/restraurants/:id
//  @access     Private
exports.updateRestaurant = AsyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new ErrorResponse("no restaurant found", 404));
  }
  const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidation: true,
  });
  res.status(200).json({
    success: true,
    data: updated,
  });
});

//  @desc       Delete restaurant
//  @route      Delete /api/v1/restraurants/:id
//  @access     Private
exports.deleteRestaurant = AsyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new ErrorResponse("no restaurant found", 404));
  }
  await Restaurant.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
