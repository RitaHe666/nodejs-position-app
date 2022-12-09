const dotenv = require('dotenv');
const errorHandler = require('../../middleware/errorHandler');

beforeAll(async () => dotenv.config());

describe('error handler ',  () => {
  const res = {
    status: jest.fn(x => x),
    json: jest.fn()
  }
  const next = jest.fn(x => x);
  
  describe('not found error handler', () => {
    it ('should send 404 status for not found error', () => {
      errorHandler.notFoundHandler({}, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.lastCall[0]?.status).toBe(404);
    })
  })
  
  describe('common error handler', () => {
    it ('should send 500 error if the passed error does not have status', () => {
      const error = new Error('new error');
      errorHandler.commonErrorHandler(error, {}, res);
      expect(res.status).toHaveBeenCalledWith(500);
    })

    it ('should send the passed error status  if the passed error has status', () => {
      const error = new Error('new error');
      error.status = 401;
      errorHandler.commonErrorHandler(error, {}, res);
      expect(res.status).toHaveBeenCalledWith(401);
    })
  })
})