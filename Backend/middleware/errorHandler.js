exports.errorHandler = (err, req, res, next) => {
  console.error(err); // replace with structured logger in prod
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
};
