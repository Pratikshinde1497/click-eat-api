const express = require("express");
require("colors");
//  get env variables
require("dotenv").config({ path: "./config/config.env" });
//  load routes
const restaurants = require("./routes/restaurants");
const dishes = require("./routes/dishes");
const reviews = require("./routes/reviews");
const users = require("./routes/users");
const auth = require("./routes/auth");

const PORT = process.env.PORT || 5000;
//  initialise express
const app = express();

//  use routes
app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/dishes", dishes);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);

//  listen on port
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  );
});
