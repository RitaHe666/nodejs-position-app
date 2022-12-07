const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const checkAuth = require('../../middleware/checkAuth');
jest.mock('jsonwebtoken');


beforeAll(async () => dotenv.config());

describe('check if a token is valid ',  () => {
  const res = {
    status: jest.fn(x => x),
    json: jest.fn(x => x)
  }
  const next = jest.fn();
  
  it ('should go to next if token is valid', () => {
    const req = {
      headers: {
        authorization: 'Bear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkZyYW5rIiwidXNlcklkIjoiNjM4ZWIzOGMxZWJkMDk3NjcxZDJlNzkzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjcwNDgzMzUyLCJleHAiOjE2NzA1Njk3NTJ9.vX4cPWWFBdGMBprSN9uq8uD_cPwat_98sC3jz_-wmc8'
      }
    }
    const now = new Date();
    jwt.verify.mockReturnValueOnce({
      userName: 'Frank',
      userId: '638eb38c1ebd097671d2e793',
      role: 'admin',
      iat: 1670483352,
      exp: now.setDate(now.getDate + 1)
    })
    checkAuth(req,  res, next);
    expect(res.user).not.toBeNull();
    expect(next).toHaveBeenCalledTimes(1)
  })

  it ('should send 401 status if token is invalid', () => {
    const req = {
      headers: {
        authorization: 'Bear 2444444'
      }
    }
    jwt.verify.mockImplementation(() => {
      throw new Error();
    })
    checkAuth(req,  res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.user).toBeUndefined();
  })
})