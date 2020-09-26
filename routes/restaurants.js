const express = require("express");
// const mongoose = require("mongoose");
const {
  addRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurant,
  updateRestaurant,
  withinRadiusRestaurants,
} = require("../controllers/restaurants");
//  load query handler middleware
const QueryHandler = require("../middelware/QueryHandler");
const food_items = require("./foodItems");
//  load model
const Restraurant = require("../models/Restraurant");
const { protect } = require("../middelware/auth");

//  initialize express router
const router = express.Router();

//  pass route to other routes
router.use("/:restaurantId/food-items", food_items);

//  restaurants within radius
router.route("/radius/:zipcode").get(withinRadiusRestaurants);
router.route("/radius/:zipcode/:distance").get(withinRadiusRestaurants);

router
  .route("/")
  .get(QueryHandler(Restraurant), getAllRestaurants)
  .post(protect, authorize("admin", "publisher"), addRestaurant);

router
  .route("/:id")
  .get(getRestaurant)
  .put(protect, authorize("admin", "publisher"), updateRestaurant)
  .delete(protect, authorize("admin", "publisher"), deleteRestaurant);

module.exports = router;
