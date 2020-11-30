const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "plases ad user name"],
  },
  email: {
    type: String,
    required: [true, "add email address of user"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "enter valid email"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, `add password of user`],
    select: false,
    minlength: 6,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  //  if password is not modified
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//  sign and return jwt token
UserSchema.methods.getJWTSignedToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

//  generate and hash reset password token
UserSchema.methods.getPasswordResetToken = function() {
  //  generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  //  hash token and set resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  //  set token expire time : 10min
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

//  return is password match ?
UserSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = new mongoose.model("User", UserSchema);
