const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
