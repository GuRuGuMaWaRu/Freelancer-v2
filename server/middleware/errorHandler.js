const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const log = req.log || logger;
  const payload = {
    err,
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
  };

  if (err.statusCode >= 500) {
    log.error(payload, err.message);
  } else if (!err.isOperational) {
    log.warn(payload, err.message);
  }

  if (req.accepts("json")) {
    res.status(err.statusCode).json({
      code: err.statusCode,
      status: err.status,
      message: err.message,
    });
  } else {
    res.type("txt").send("404 Not Found");
  }
};

module.exports = errorHandler;
