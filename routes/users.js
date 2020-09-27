const express = require("express");
const User = require("../models/User");
const QueryHandler = require("../middelware/QueryHandler");
const { protect, authorize } = require("../middelware/auth");
const router = express.Router();

const {
  getAllUsers,
  addUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

//  use protection over routes
router.use(protect, authorize("admin"));

router.route("/").get(QueryHandler(User), getAllUsers).post(addUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
