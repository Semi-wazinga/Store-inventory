const errorHandler = (err, req, res, next) => {
  console.error("unhandled error", err);
  const status = err?.status || 500;
  // do not leak stack to client in production
  res.status(status).json({ error: err?.message || "internal server error" });
};

module.exports = errorHandler;
