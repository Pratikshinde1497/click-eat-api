const express = require("express");
//  load all routes
const {
  getAllFoodItems,
  addFoodItem,
  getFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require("../controllers/foodItems");
const QueryHandler = require("../middelware/QueryHandler");
//  load model
const FoodItem = require("../models/FoodItem");

const router = express.Router({ mergeParams: true });

//  for all
router
  .route("/")
  .get(QueryHandler(FoodItem), getAllFoodItems)
  .post(addFoodItem);

//  items with id
router
  .route("/:id")
  .get(getFoodItem)
  .put(updateFoodItem)
  .delete(deleteFoodItem);

module.exports = router;
