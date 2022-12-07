const strings = require('../util/strings');

module.exports = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!roles?.includes(req.user?.role)) {
      res.status(401);
      return res.json({ message: strings.not_have_access });
    }
    next();
  }
}