const express = require("express");
// const mongoose = require("mongoose");
const {
  addRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurant,
  updateRestaurant,
} = require("../controllers/restaurants");

//  initialize express router
const router = express.Router();

router.route("/").get(getAllRestaurants).post(addRestaurant);

router
  .route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);

module.exports = router;
