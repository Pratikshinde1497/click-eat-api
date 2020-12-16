const FoodItemOrder = require("../models/FoodItemOrder");
const ErrorResponse = require("../utility/ErrorResponse");
const AsyncHandler = require("../middelware/Async");
const Order = require("../models/Order");
const User = require("../models/User");
const Restraurant = require("../models/Restraurant");

//  @desc       Get all orders
//  @route      GET /api/v1/orders
//  @access     Private
exports.getAllOrders = AsyncHandler(async (req, res, next) => {
  
    //  continue
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  });

//  @desc       Add new order
//  @route      POST /api/v1/users/orders
//  @access     Private
exports.addOrder = AsyncHandler(async (req, res, next) => {

  const callback = async (orderIds) => {
    let orderItems = [], totalCost = 0;

    orderIds.forEach((item)=> {
      orderItems.push(item[0]);
      totalCost += item[1];
    })

    const order = {
      restaurant: req.body.restaurant,
      customer: req.body.customer,
      orderItems,
      totalCost
    }
    const ordered = await Order.create(order);
    res.status(201).json({
      success: true,
      data: ordered,
    });
  }

  const promise_order_item = new Promise(async(resolve, reject) => {
    let orderIds = [];

    const items = req.body.orderItems;
    //  check for user
    const user = await User.findById(req.body.customer);
    if (!user) {
      return reject(new ErrorResponse('User Not Found', 401))
    }

    //  check for restaurant
    const restaurant = await Restraurant.findById(req.body.restaurant);
    if (!restaurant) {
      return reject(new ErrorResponse('Restaurant Not Found', 404))
    }

    if(!!user && !!restaurant) {
      Object.keys(items).forEach(async (index) => {
        const foodItem = items[index]._id;
        //  check quantity, if 1 or 0 make it 1;
        const quantity = items[index].quantity <= 1 ? 1 : items[index].quantity;
        const calculatedPrice = items[index].price * quantity;
        
        //  add each item to fooditemorder collection
        const orderItem = await FoodItemOrder.create({ foodItem, quantity, calculatedPrice});
        
        //  add order id into array of ids
        orderIds.push([orderItem._id, calculatedPrice]);
        if (items.length == orderIds.length) {
          resolve(orderIds);
        }
      })
    }
  })
  
  promise_order_item
    .then(callback)
    .catch((msg)=> {
      next(msg);
    })
});