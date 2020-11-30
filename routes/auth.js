const express = require("express");
const { registerUser, loginUser, getMe, updatePassword } = require("../controllers/auth");
const { protect } = require("../middelware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getMe").get(protect, getMe);
router.route("/updatepassword").put(protect, updatePassword)

module.exports = router;
