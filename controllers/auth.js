const AsyncHandler = require("../middelware/Async");
const User = require("../models/User");

//  @desc       Regitser/add user
//  @route      POST /api/v1/auth/register
//  @access     Public
exports.registerUser = AsyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getJWTSignedToken();

  res.status(201).json({
    success: true,
    token,
  });
});
