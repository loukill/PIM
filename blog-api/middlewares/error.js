exports.handleAsyncError = (err, req, res, next) => {
  res.status(500).json({ errro: err.message || err });
};
