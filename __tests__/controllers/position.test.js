const positionControl = require('../../controllers/position');
const Position= require('../../models/position');
const strings = require('../../util/strings');
const dotenv = require('dotenv');
const positionEmitter = require('../../util/events');
jest.mock('../../models/position');
jest.mock('../../util/events');

beforeAll(async () => dotenv.config());

describe('position controller',  () => {
	const response = {
		status: jest.fn(x => x),
		json: jest.fn(x => x)
	}

	const opening = {
		_id: '638eb635b3df2f2cbb74f04d',
		projectName: 'MBL3',
		technologies: [
			'React',
			'JS'
		],
		role: 'developer',
		creator: '638d76c352e94a1270d2a63f'
	};

	const updatePositionReq = { 
		params: { id: '638eb635b3df2f2cbb74f04d'},
		user: { userId: '638d76c352e94a1270d2a63f'},
	};
	const applyReq = { 
		body: { id: '638eb635b3df2f2cbb74f04d'},
		user: { userId: '638d76c352e94a1270d2a63f'}
	};
	const queryId = '638eb635b3df2f2cbb74f04d';
	const bodyIdReq = { body: {  id: queryId } };

  describe('add a position', () => {
		it('should send 200 status if successfully creating a position', async () => {
			const data = {
				projectName: 'World Cup',
				clientName: 'abc TV',
				technologies: ['React', 'JS'],
				role: 'developer',
			};
			const userId = '63870c157fb18b41c7a6e62a';
			const request = { body: { ...data }, user: { userId } };
			Position.prototype.save = jest.fn().mockImplementation(() => ({}));
			await positionControl.addPosition(request, response);
			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.json).toHaveBeenCalledTimes(1);
		})
	})
	
	describe('get a summaries list of all available opening', () => {
		it('should send 200 status if successfully returning all available opening position', async () => {
			const doc = [opening]
			Position.find.mockResolvedValueOnce(doc);
			await positionControl.getAllSummaries({}, response);
			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.json).toHaveBeenCalledTimes(1);
			expect(response.json).toHaveReturnedWith({
				message: strings.success,
				result: doc
			});
		})
	})

	describe('get all details of a position', () => {
		it('should send 200 status if successfully returning a position', async () => {
			Position.find.mockImplementationOnce(x => {
				this.populate = () => {
					return { x, populate: this.populate };
				}
				return { x, populate: this.populate };
			});
			await positionControl.getPosition(bodyIdReq, response);
			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.json).toHaveBeenCalledTimes(1);
		})
	})

	describe('delete a position', () => {
		it('should send 404 status if not finding the position to delete', async () => {
			Position.findById.mockResolvedValueOnce(undefined);
			await positionControl.deletePosition(updatePositionReq, response);
			expect(response.status).toHaveBeenCalledWith(404);
			expect(response.json).toHaveBeenCalledTimes(1);
		})
	
		it('should send 401 status if not finding the position to delete', async () => {
			Position.findById.mockResolvedValueOnce({ creator: '638d76c352e94a1271111111' });
			await positionControl.deletePosition(updatePositionReq, response);
			expect(response.status).toHaveBeenCalledWith(401);
			expect(response.json).toHaveBeenCalledTimes(1);
		})
	
		it('should send 200 status if successfully deleting a position', async () => {
			Position.findById.mockResolvedValueOnce(opening);
			await positionControl.deletePosition(updatePositionReq, response);
			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.json).toHaveBeenCalledTimes(1);
		})
	})

	describe('update a position', () => {
		it('should send 404 status if not finding the position to update', async () => {
			Position.findById.mockResolvedValueOnce(undefined);
			await positionControl.updatePosition(bodyIdReq, response);
			expect(response.status).toHaveBeenCalledWith(404);
			expect(response.json).toHaveBeenCalledTimes(1);
			expect(response.json).toHaveReturnedWith({
				message: strings.not_found_position
			});
		})
	
		it('should emit close event if closing an position', async () => {
			const req = {
				body: {
					id: opening.id,
					projectName: 'test',
					status: false
				}
			}
			Position.findById.mockResolvedValueOnce({ 
				...opening,
				status: true,
				save: () => ({
					...opening,
					projectName: 'test',
					status: false
				})
			});
			Position.prototype.save = jest.fn().mockImplementation(() => ({
				...opening,
				projectName: 'test',
				status: false
			}));
			
			positionEmitter.emit.mockImplementation(() => {});
			await positionControl.updatePosition(req, response);
			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.json).toHaveBeenCalledTimes(1);
			expect(positionEmitter.emit).toHaveBeenCalledTimes(1);
		})	
	})

	describe('apply a position', () => {
		it('should send 400 status if applying a position without position id', async () => {
			await positionControl.applyPosition({ body: {}, user: { userId: '638d76c352e94a1271111111' } }, response);
			expect(response.status).toHaveBeenCalledWith(400);
			expect(response.json).toHaveBeenCalledTimes(1);
			expect(response.json).toHaveBeenCalledWith({ message: strings.no_position_id });
		})
	
		it('should send 400 status if applying a position without userId id', async () => {
			await positionControl.applyPosition({ body: { id: '778d76c352e94a1271111111'}, user: {} }, response);
			expect(response.status).toHaveBeenCalledWith(400);
			expect(response.json).toHaveBeenCalledTimes(1);
			expect(response.json).toHaveBeenCalledWith({ message: strings.no_user_id });
		})
	
		it('should send 404 status if not finding the position to apply', async () => {
			Position.findById.mockResolvedValueOnce(undefined);
			await positionControl.applyPosition(applyReq, response);
			expect(response.status).toHaveBeenCalledWith(404);
			expect(response.json).toHaveBeenCalledTimes(1);
			expect(response.json).toHaveBeenCalledWith({ message: strings.not_found_position });
		})
	
		it('should send 400 status if not finding the position to apply', async () => {
			Position.findById.mockResolvedValueOnce({ status: false });
			await positionControl.applyPosition(applyReq, response);
			expect(response.status).toHaveBeenCalledWith(400);
			expect(response.json).toHaveBeenCalledTimes(1);
			expect(response.json).toHaveBeenCalledWith({ message: strings.position_closed });
		})
	})
	describe('get all ids of applicants', () => {
		it('should send 200 status if successfully get all ids of applicants', async () => {
			Position.find.mockResolvedValueOnce([{
				applicants: ['638d76c352e94a1271111111']
			}]);
			await positionControl.getAllApplicantIds({}, response);
			expect(response.status).toHaveBeenCalledWith(200);
			expect(response.json).toHaveBeenCalledTimes(1);
		})
	})
});

