const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

/* CORS and Body Parsing Middleware */
app.use(express.json());
app.use(cors());

/* request logger */
app.use(requestLogger);

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
