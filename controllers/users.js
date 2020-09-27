const User = require("../models/User");
const ErrorResponse = require("../utility/ErrorResponse");
const AsyncHandler = require("../middelware/Async");
const Restraurant = require("../models/Restraurant");

//  @desc       Get all Users
//  @route      GET /api/v1/users
//  @access     Public
exports.getAllUsers = AsyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResponce);
});

//  @desc       Get User
//  @route      GET /api/v1/users/:id
//  @access     Public
exports.getUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("no User found", 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//  @desc       Add new User
//  @route      POST /api/v1/users
//  @access     Private
exports.addUser = AsyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

//  @desc       Update User
//  @route      PUT /api/v1/users/:id
//  @access     Private
exports.updateUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("no User found", 404));
  }
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidation: true,
  });
  res.status(200).json({
    success: true,
    data: updated,
  });
});

//  @desc       Delete User
//  @route      Delete /api/v1/users/:id
//  @access     Private
exports.deleteUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("no User found", 404));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
