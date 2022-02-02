const express = require("express");
const app = express();
const ErrorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
// Route imports
const user = require("./routes/userRoutes.js");
const product = require("./routes/productRoutes.js");
const order = require("./routes/orderRoutes.js");

// parsing the body to json format
app.use(express.json());
// parsing the cookies
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// route middlewares
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);

// Middlewares for errors
app.use(ErrorMiddleware);
module.exports = app;
