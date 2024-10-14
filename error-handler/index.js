const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Internal Server Error';

  // Catch Duplicate Error In MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      status: err.status,
      message: 'Tên đã tồn tại',
      stack: process.env.NODE_ENV === 'dev' ? err.stack : undefined,
    });
  }

  return res.status(err.statusCode).json({
    //  error: err,
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'dev' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
