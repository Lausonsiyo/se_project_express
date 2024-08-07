const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const helmet = require("helmet");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const rateLimiter = require("./middlewares/rateLimiter");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

/*  Use Helmet to set security headers */
app.use(helmet());

/* Use the rate limiter middleware */
app.use(rateLimiter);

/* CORS and Body Parsing Middleware */
app.use(express.json());
app.use(cors());

/* request logger */
app.use(requestLogger);

/* Server crash testing */
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

/* Routes */
app.use("/", indexRouter);

/* error logger */
app.use(errorLogger);

/* celebrate error handler */
app.use(errors());

/* centralized handler */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
