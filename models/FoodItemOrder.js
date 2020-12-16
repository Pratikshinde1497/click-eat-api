const mongoose = require('mongoose');

const FoodItemOrderSchema= new mongoose.Schema({
  foodItem: {
    type: mongoose.Types.ObjectId,
    ref: "FoodItem",
    required: [ true, 'select food item first' ]
  },
  quantity: {
    type: Number,
    default: 1
  },
  calculatedPrice: {
    type: Number,
    required: [true, 'add calculated total']
  }
})

module.exports = new mongoose.model('FoodItemOrder', FoodItemOrderSchema)