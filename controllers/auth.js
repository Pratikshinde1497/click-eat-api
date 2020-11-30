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

//  @desc       Login user
//  @route      GET /api/v1/auth/getMe
//  @access     Private
exports.getMe = AsyncHandler(async (req, res, next) => {
  const user = await req.user;
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update user password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = AsyncHandler(async (req, res, next) => {
  //  get user details
  const user = await User.findById(req.user.id).select('+password');
  if(!user) {
    return next(new ErrorResponse(`no user found with id: ${req.user.id}`, 400));
  }
  if(!(await user.comparePasswords(req.body.currentPassword))) {
    return next(new ErrorResponse(`Invalid credentials`, 400));
  }
  user.password = req.body.newPassword;
  //  save new password
  await user.save({validateBeforeSave: true});

  sendTokenResponse(user, 200, res);
})

// @desc      Helper function to send response
const sendTokenResponse = (user, statusCode, res) => {
  //  get Token
  const token = user.getJWTSignedToken();
  //  set cookie options
  // const options = {
  //   expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
  //   httpOnly: true
  // }
  if(process.env.NODE_ENV === 'production') {
    options.secure = true
  }
  //  send response
  res
    .status(statusCode)
    // .cookie('token', token, options)
    .json({
      success: true,
      token
  })
}
