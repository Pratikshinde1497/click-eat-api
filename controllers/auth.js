const AsyncHandler = require("../middelware/Async");
const User = require("../models/User");
const mongoose = require("mongoose");
const crypto = require('crypto');
const ErrorResponse = require("../utility/ErrorResponse");
const SendMail = require("../utility/SendMail");

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
  //  create mail message
  const message = `You CLICK-EAT account password has updated successfully \n\n Thank you!`;

  try {
    sendTokenResponse(user, 200, res);
    
    await SendMail({
      sendTo: user.email,
      subject: 'Click-Eat Update Password',
      text: message,
      html: `<p>${message}</p>`
    });
    //  give response 
  } catch (err) {
    return next(new ErrorResponse(`error while sending mail`, 500))
  }
})

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotpassword = AsyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  //  if no user
  if(!user) {
    return next(new ErrorResponse(`no user with that email found`, 404));
  }
  //  get reset token from model
  const resetToken = user.getPasswordResetToken();
  //  save token and expire time in db
  await user.save({ validateBeforeSave: false });
  //  create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  
  //  create msg to send in email 
  const message = `You are getting this message because you or someone else tring to reset passsword; 
  if its you then make sure, you make <b>PUT</b> request to ${resetUrl} with newPassword in JSON body.
  
  Thank You!!`;
  try {    
    await SendMail({
      sendTo: user.email,
      subject: 'Click-Eat Reset Password Request Found',
      text: message,
      html: `<p>${message}</p>`
    });
    //  give response 
    res.status(200).json({
      success: true,
      data: resetToken
    })
  } catch (err) {
    return next(new ErrorResponse(`error while sending mail`, 500))
  }
})

// @desc      Reset Password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = AsyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
  //  find user with same reset token and expire time greater
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  //  not found
  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400))
  }

  //  make changes
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.password = req.body.password;
  //  save entry
  await user.save();
  //  create mail message
  const message = `Password Reset Successfully Complete.\n\n Thank you!`;
  try {    

    await SendMail({
      sendTo: user.email,
      subject: 'From Click-Eat',
      text: message,
      html: `<p>${message}</p>`
    });

    //  give response 
    sendTokenResponse(user, 200, res);
  } catch (err) {
    return next(new ErrorResponse(`error while sending mail`, 500))
  }
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
  // if(process.env.NODE_ENV === 'production') {
  //   options.secure = true
  // }
  //  send response
  res
    .status(statusCode)
    // .cookie('token', token, options)
    .json({
      success: true,
      token
  })
}
