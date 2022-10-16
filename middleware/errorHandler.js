const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.log(object);
  res.status(500).send(err.messge);
};

module.exports = errorHandler;
