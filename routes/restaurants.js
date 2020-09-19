const express = require("express");
// const mongoose = require("mongoose");
const Restaurant = require("../models/Restraurant");

const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    const restraurants = await Restaurant.find();
    res.json({
      success: true,
      data: restraurants,
    });
  })
  .post(async (req, res, next) => {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
      success: true,
      data: restaurant,
    });
  });

module.exports = router;
