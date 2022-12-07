const strings = require('../util/strings');
const notFoundHandler = (req, res, next) => {
  const error = new Error(strings.not_found);
  error.status = 404;
  next(error);
}

const commonErrorHandler = (error, req, res) => {
  res.status(error.status || 500);
  res.json({ error });
}

module.exports = {
  notFoundHandler,
  commonErrorHandler
}