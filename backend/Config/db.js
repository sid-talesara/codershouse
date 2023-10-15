require("dotenv").config();
const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connection = mongoose.connection;

  connection.on("error", () => {
    console.log(`----MongoDB connection failed----`.bgRed.black);
  });

  connection.once("open", () => {
    console.log(`------- MongoDB connected --------`.bgGreen.black);
  });
};

module.exports = connectDB;
