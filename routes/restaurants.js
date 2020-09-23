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
//  load model
const Restraurant = require("../models/Restraurant");

//  initialize express router
const router = express.Router();

router.route("/radius/:zipcode").get(withinRadiusRestaurants);
router.route("/radius/:zipcode/:distance").get(withinRadiusRestaurants);

router
  .route("/")
  .get(QueryHandler(Restraurant), getAllRestaurants)
  .post(addRestaurant);

router
  .route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);

module.exports = router;
