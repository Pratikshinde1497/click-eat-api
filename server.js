const express = require("express");
require("colors");
//  get env variables
const connectToDatabase = require("./config/db");
require("dotenv").config({ path: "./config/config.env" });
const ErrorHandler = require("./middelware/ErrorHandler");

//  load routes
const restaurants = require("./routes/restaurants");
const dishes = require("./routes/foodItems");
const reviews = require("./routes/reviews");
const users = require("./routes/users");
const auth = require("./routes/auth");

const PORT = process.env.PORT || 5000;
//  initialise express
const app = express();

//  connection to db
connectToDatabase();

//  use body parser
app.use(express.json());

//  use routes
app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/food-items", dishes);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);

//  error handling
app.use(ErrorHandler);

//  listen on port
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  );
});
