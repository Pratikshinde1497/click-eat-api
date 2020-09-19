const mongoose = require("mongoose");
require("colors");

const connectToDatabase = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `DATABASE CONNECTED: ${conn.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectToDatabase;
