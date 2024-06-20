const path = require("path");

const express = require("express");
const cors = require("cors");
const compression = require("compression");
const dotenv = require("dotenv");
const morgan = require("morgan");

const dbConnection = require("./config/dbconnection");
const ApiError = require("./utils/apiError");
const glabalError = require("./middlewares/errorMiddleware");
// Routes
const mountRoutes = require("./routes");



dotenv.config({ path: "config.env" });

//connect with db
dbConnection();

// express app
const app = express();

// enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression())

//middleWares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "brands")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

// Routes
mountRoutes(app);


app.all("*", (req, res, next) => {
  // create error and send it to error handling middleware
  // const err = new Error(`Can't find this route: ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(glabalError);

const PORT = process.env.PORT || 8000;

const server = app.listen(8000, () => {
  console.log(`App running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error:${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`shutting down...`);
    process.exit(1);
  });
});
