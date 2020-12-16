const mongoose = require('mongoose');

const OrderSchema= new mongoose.Schema({
  orderItems: [{
    type: mongoose.Types.ObjectId,
    ref: "FoodItemOrder",
    required: [ true, "add ordered items list"]
  }],
  restaurant: {
    type: mongoose.Types.ObjectId,
    ref: "Restaurant",
    required: [ true, 'provide restaurant id']
  },
  customer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [ true, 'provide customer id']
  },
  pickup: {
    type: Date,
    default: Date.now()  + 30 * 60 * 1000,
  },
  totalCost: {
    type: Number,
    required: ['true', 'provide total cost of order']
  }
})

module.exports = new mongoose.model('Order', OrderSchema)