const express = require("express");

const router = express.Router();

router.route("/").get((req, res, next) => {
  res.json({
    success: true,
    data: "in reviews",
  });
});

module.exports = router;
