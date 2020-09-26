const AsyncHandler = require("../middelware/Async");
const User = require("../models/User");
const mongoose = require("mongoose");

const ErrorResponse = require("../utility/ErrorResponse");

//  @desc       Regitser/add user
//  @route      POST /api/v1/auth/register
//  @access     Public
exports.registerUser = AsyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  //  send token
  sendTokenResponse(user, 201, res);
});

//  @desc       Login user
//  @route      GET /api/v1/auth/login
//  @access     Public
exports.loginUser = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return next(new ErrorResponse(`Credentials not Provided`, 400));
  }
  //  check user exists?
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }
  //  compare passwords
  const isMatch = await user.comparePasswords(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid Credentials`, 401));
  }
  //  send token
  sendTokenResponse(user, 200, res);
});

//  helper function to send token response to user
function sendTokenResponse(user, statusCode, res) {
  const token = user.getJWTSignedToken();

  res.status(statusCode).json({
    success: true,
    token,
  });
}
