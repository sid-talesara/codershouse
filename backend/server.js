const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const router = require("./Routes/Routes");
const connectDB = require("./Config/db")();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = new express();

const PORT = process.env.PORT || 8080;

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
};
app.use("/storage", express.static("storage"));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: "8mb" }));
app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`  Server is running on port ${PORT}  `.bgGreen.black);
});
