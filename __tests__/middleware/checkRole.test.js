const dotenv = require('dotenv');
const roles = require('../../util/role');
const checkRole = require('../../middleware/checkRole');
const strings = require('../../util/strings');

beforeAll(async () => dotenv.config());

describe('check if a user have access ',  () => {
  const res = {
    status: jest.fn(x => x),
    json: jest.fn(x => x)
  }
  const next = jest.fn();
  
  it ('should go to next if the role is in allowed role list', () => {
    const req = { user: { role: roles.User } }
    checkRole([roles.Admin, roles.User])(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  })

  it ('should send 401 status if the role is not in allowed role list', () => {
    const req = { user: { role: roles.User } }
    checkRole([roles.Admin])(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: strings.not_have_access  })
  })
})