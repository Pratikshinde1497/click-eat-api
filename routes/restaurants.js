const express = require("express");
const mongoose = require("mongoose");
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

router
  .route("/:id")
  .get(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(new Error("no restaurant found"));
    }
    res.status(200).json({
      success: true,
      data: restaurant,
    });
  })
  .put(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(new Error("no restaurant found"));
    }
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidation: true,
      }
    );
    res.status(200).json({
      success: true,
      data: updated,
    });
  })
  .delete(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(new Error("no restaurant found"));
    }
    await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {},
    });
  });

module.exports = router;
