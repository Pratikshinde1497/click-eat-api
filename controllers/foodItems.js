const FoodItem = require("../models/FoodItem");
const ErrorResponse = require("../utility/ErrorResponse");
const AsyncHandler = require("../middelware/Async");
const Restraurant = require("../models/Restraurant");

//  @desc       Get all FoodItems
//  @route      GET /api/v1/restaurants/:restaurantId/food-items
//  @route      GET /api/v1/food-items
//  @access     Public
exports.getAllFoodItems = AsyncHandler(async (req, res, next) => {
  if (!req.params.restaurantId) {
    res.status(200).json(res.advancedResponce);
  } else {
    //  check for restaurant is there in db
    const restaurant = await Restraurant.findById(req.params.restaurantId);
    //  if not then send error
    if (!restaurant) {
      return next(new ErrorResponse(`no restaurant found`, 404));
    }
    //  continue
    const food_items = await FoodItem.find({
      restaurant: req.params.restaurantId,
    });
    res.status(200).json({
      status: true,
      count: food_items.length,
      data: food_items,
    });
  }
});

//  @desc       Get FoodItem
//  @route      GET /api/v1/restaurants/:restaurantId/food-items/:id
//  @route      GET /api/v1/food-items/:id
//  @access     Public
exports.getFoodItem = AsyncHandler(async (req, res, next) => {
  const food_item = await FoodItem.findById(req.params.id);
  if (!food_item) {
    return next(new ErrorResponse("no FoodItem found", 404));
  }
  res.status(200).json({
    success: true,
    data: food_item,
  });
});

//  @desc       Add new FoodItem
//  @route      POST /api/v1/food-items
//  @access     Private
exports.addFoodItem = AsyncHandler(async (req, res, next) => {
  req.body.restaurant = req.params.restaurantId;

  const item = await FoodItem.create(req.body);
  res.status(201).json({
    success: true,
    data: item,
  });
});

//  @desc       Update FoodItem
//  @route      PUT /api/v1/food-items/:id
//  @access     Private
exports.updateFoodItem = AsyncHandler(async (req, res, next) => {
  const food_item = await FoodItem.findById(req.params.id);
  if (!food_item) {
    return next(new ErrorResponse("no FoodItem found", 404));
  }
  const updated = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidation: true,
  });
  res.status(200).json({
    success: true,
    data: updated,
  });
});

//  @desc       Delete FoodItem
//  @route      Delete /api/v1/food-items/:id
//  @access     Private
exports.deleteFoodItem = AsyncHandler(async (req, res, next) => {
  const food_item = await FoodItem.findById(req.params.id);
  if (!food_item) {
    return next(new ErrorResponse("no FoodItem found", 404));
  }
  await FoodItem.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
