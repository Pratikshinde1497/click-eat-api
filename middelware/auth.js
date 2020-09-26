const AsyncHandler = require("../middelware/Async");
const ErrorResponse = require("../utility/ErrorResponse");
require("dotenv").config({ path: "./config/config.env" });
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//  PROTECTOR ANLY ALLOWS TO ACESS RESOURCE, IF USER HAS TOKEN
exports.protect = AsyncHandler(async (req, res, next) => {
  let token;
  //  check if req has token and which starts "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ErrorResponse(`Not Authorized to Access Resource`, 401));
  }
  //  decode token get "id" of user from token, find that user and
  //  append it to req for further usage
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse(`Not Authorized to Access`, 401));
  }
});

//  AUTHORIZE FUNCTION ALLOWS ONLY THE USER WITH ALLOWED ROLE TO ACCESS ROUTE
exports.authorize = (...roles) => {
  return (req, res, next) => {
    //  if user role is not mentioned in roles
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`Not Authorized to Access Resource`, 403));
    }
    next();
  };
};
