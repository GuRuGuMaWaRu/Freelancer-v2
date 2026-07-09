const rateLimit = require("express-rate-limit");

const logger = require("../utils/logger");
const AppError = require("../utils/appError");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per `window` per minute
  message: {
    message:
      "Too many login attempts from this IP, please try again after a 60 second pause",
  },
  handler: (req, res, next, options) => {
    const log = req.log || logger;

    log.warn(
      {
        method: req.method,
        url: req.url,
        origin: req.headers.origin,
      },
      options.message.message,
    );

    return next(new AppError(options.statusCode, options.message.message));
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
