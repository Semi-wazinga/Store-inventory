const rateLimit = require("express-rate-limit");

// Rate limiter for auth endpoints to mitigate brute-force attacks
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // limit each IP to 8 requests per window
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
