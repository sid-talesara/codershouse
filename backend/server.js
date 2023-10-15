const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const router = require("./Routes/Routes");
const connectDB = require("./Config/db")();
const cors = require("cors");
const app = new express();

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: ["http://localhost:3000"],
};
app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`  Server is running on port ${PORT}  `.bgGreen.black);
});
