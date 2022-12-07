const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    // The token passed to headers should be like have a prefix 'Bear'.
    // eg: Bear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkZyYW5rIiwidXNlcklkIjoiNjM4ZWIzOGMxZWJkMDk3NjcxZDJlNzkzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjcwNDgzMzUyLCJleHAiOjE2NzA1Njk3NTJ9.vX4cPWWFBdGMBprSN9uq8uD_cPwat_98sC3jz_-wmc8
    const decoded = jwt.verify(req.headers.authorization?.split(' ')?.[1], process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch(error) {
    res.status(401);
    return res.json({ error });
  }
}