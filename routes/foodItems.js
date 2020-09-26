const express = require("express");
//  load all routes
const {
  getAllFoodItems,
  addFoodItem,
  getFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require("../controllers/foodItems");
const { protect, authorize } = require("../middelware/auth");
const QueryHandler = require("../middelware/QueryHandler");
//  load model
const FoodItem = require("../models/FoodItem");

const router = express.Router({ mergeParams: true });

//  for all
router
  .route("/")
  .get(QueryHandler(FoodItem), getAllFoodItems)
  .post(protect, authorize("admin", "publisher"), addFoodItem);

//  items with id
router
  .route("/:id")
  .get(getFoodItem)
  .put(protect, authorize("admin", "publisher"), updateFoodItem)
  .delete(protect, authorize("admin", "publisher"), deleteFoodItem);

module.exports = router;
