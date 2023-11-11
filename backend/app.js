const express = require("express");
const cors = require("cors");
const app = express();

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Utils
const ErrorHandler = require("./utils/errorHandler");

// Middleware
const errorMiddleware = require("./middleware/errors");
const morgan = require("morgan");

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.post(
  "/api/v1/webhook",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true })); //Parse URL-encoded bodies
app.use(fileUpload());
app.use(morgan("tiny"));

// Import all routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const order = require("./routes/order");

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", payment);
app.use("/api/v1", order);

//errors dealing with unhandled routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
