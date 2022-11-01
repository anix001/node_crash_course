require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require(path.join(__dirname, "middleware", "logEvents.js"));
const errorHandler = require(path.join(
  __dirname,
  "middleware",
  "errorHandler.js"
));
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require(path.join(__dirname, "config", "dbConn.js"));
const PORT = process.env.PORT || 3500;

//connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

//handle options credentials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials);

//cross-origin resource sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data
//in other words, form data:
//'context-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//middleware for cookie
app.use(cookieParser());

// cross origin Resource Sharing -third party middleware
// app.use(cors());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

//using routes from another files
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
//routs-for api
app.use("/register", require("./routes/api/register"));
app.use("/auth", require("./routes/api/auth"));
app.use("/refresh", require("./routes/api/refresh"));
app.use("/logout", require("./routes/api/logout"));

//verifyJWT middleware is used for employee api to verify accesstoken
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));
app.use("/users", require("./routes/api/users"));

//Route Handlers
// app.get(
//   "/hello(.html)?",
//   (req, res, next) => {
//     console.log("attempted to load hello.html");
//     next();
//   },
//   (req, res) => {
//     res.send("hello world");
//   }
// );

//chaining route handlers
// const one = (req, res, next) => {
//   console.log("one");
//   next();
// };
// const two = (req, res, next) => {
//   console.log("two");
//   next();
// };
// const three = (req, res) => {
//   console.log("three");
//   res.send("finished");
// };

// app.get("/chain(.html)?", [one, two, three]);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", function () {
  console.log("Mongo connection established");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
});
