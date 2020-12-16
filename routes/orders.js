const express = require("express");
const { addOrder, getAllOrders } = require("../controllers/orders");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllOrders)
  .post(addOrder)

module.exports = router;