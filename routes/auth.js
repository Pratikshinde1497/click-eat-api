const express = require("express");
const { registerUser, loginUser, getMe, updatePassword, forgotpassword, resetPassword, getAllOrdersByCustomer, getAllOrdersByRestaurant } = require("../controllers/auth");
const { protect } = require("../middelware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getMe").get(protect, getMe);
router.route("/updatepassword").put(protect, updatePassword)
router.route("/forgotpassword").post(forgotpassword)
router.route("/resetpassword/:resettoken").put(resetPassword)
router.route('/user/:id/orders').get(getAllOrdersByCustomer)
router.route('/restaurant/:restaurant_id/orders').get(getAllOrdersByRestaurant)



module.exports = router;
