const express = require("express");
const path = require('path');
const cors = require('cors');
require("colors");
//  get env variables
const connectToDatabase = require("./config/db");
require("dotenv").config({ path: "./config/config.env" });
const ErrorHandler = require("./middelware/ErrorHandler");
//  security modules
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
//  load routes
const restaurants = require("./routes/restaurants");
const dishes = require("./routes/foodItems");
const reviews = require("./routes/reviews");
const users = require("./routes/users");
const auth = require("./routes/auth");
const orders= require("./routes/orders");

const PORT = process.env.PORT || 5000;
//  initialise express
const app = express();

//  use cross origin resource sharing
app.use(cors());
//  connection to db
connectToDatabase();

//  use body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  sanitize data to prevent NO-SQL injection
app.use(mongoSanitize());

//  Helmet helps you secure your Express apps by setting various HTTP headers.  
//  Instead all those lines we can also write
//  app.use(helmet());
app.use(helmet.contentSecurityPolicy( {
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: ["'self'", 'https://nominatim.openstreetmap.org'],
    imgSrc: ["'self'", 'https://*.tile.openstreetmap.org']
  }
}));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

//  prevent XSS attack
app.use(xss());

//  limit requests per device within period of time
app.use(rateLimit({
  windowMS: 10 * 60 * 1000,       // 10 min 
  max: 100                       //  100 requests
}));

//  prevent http params polution
app.use(hpp());

//  public pages
app.use(express.static(path.join(__dirname, './public')))
// app.get('/', (req, res) => {
//   res.json({
//     data: 'hello, this is click eat app public home page to login make /api/v1/auth/login request with email: and password:  fields'
//   })
// })

//  use routes
app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/food-items", dishes);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/orders", orders);

//  error handling
app.use(ErrorHandler);

//  listen on port
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  );
});
