const userControl = require('../../controllers/user');
const User= require('../../models/user');
const strings = require('../../util/strings');
const dotenv = require('dotenv');
jest.mock('../../models/user');

beforeAll(async () => dotenv.config());

describe('user controller ',  () => {
	const response = {
		status: jest.fn(x => x),
		json: jest.fn(x => JSON.stringify(x))
	}
  
	it('should send 401 status if password is wrong', async () => {
		const request = {
			body: {
				userName: 'Lucy',
				password: '123456'
			}
		}
		User.findOne.mockResolvedValueOnce({
			userName: 'Lucy',
			password: '654321',
		});
		await userControl.login(request, response);
		expect(response.status).toHaveBeenCalledWith(401);
		expect(response.json).toHaveBeenCalledTimes(1);
		expect(response.json).toHaveBeenCalledWith({ message: strings.wrong_password  })
	})
  
	it('should send 401 status if user name doesn\'t exist', async () => {
		const request = {
			body: {
				userName: 'Lucy',
				password: '123456'
			}
		}
		User.findOne.mockResolvedValueOnce(undefined);
		await userControl.login(request, response);
		expect(response.status).toHaveBeenCalledWith(401);
		expect(response.json).toHaveBeenCalledTimes(1);
		expect(response.json).toHaveBeenCalledWith({ message: strings.not_found_user  })
	})

	it('should send 200 status if successfully login', async () => {
		const user = {
			userName: 'Lucy',
			password: '123456'
		};
		const request = { body: { ...user } }
		User.findOne.mockResolvedValueOnce({ ...user, _id: 'fake_id'});
		await userControl.login(request, response);
		expect(response.status).toHaveBeenCalledWith(200);
		expect(response.json).toHaveBeenCalledTimes(1);
	})
});
