const ErrorResponse = require("../utility/ErrorResponse");

const ErrorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  //  mongoose bad objectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 400);
  }

  //  mongoose duplicate value
  if (err.code === 11000) {
    const message = `Duplicate value provided`;
    error = new ErrorResponse(message, 400);
  }

  //  mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message || "server error",
  });
};

module.exports = ErrorHandler;
