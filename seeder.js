require("colors");
require("dotenv").config({ path: "./config/config.env" });
const mongoose = require("mongoose");
const fs = require("fs");
//  load models
const Restraurant = require("./models/Restraurant");
const User = require("./models/User");
const FoodItem = require("./models/FoodItem");

//  connect to db
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const users = JSON.parse(fs.readFileSync(`${__dirname}/test_data/users.json`, "utf-8"));
const restraurants = JSON.parse(fs.readFileSync(`${__dirname}/test_data/restraurants.json`, "utf-8"));
const foodItems = JSON.parse(fs.readFileSync(`${__dirname}/test_data/foodItems.json`, "utf-8"));

const importData = async () => {
  try {

    await User.create(users);
    await Restraurant.create(restraurants);
    await FoodItem.create(foodItems);

    console.log(`Data Imported Successfully..`.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Restraurant.deleteMany();
    await FoodItem.deleteMany();

    console.log(`Data Deleted Successfully..`.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//  check command
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("sorry, seeder unable to understand");
  process.exit();
}
