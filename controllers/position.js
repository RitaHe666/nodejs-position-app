const mongoose = require('mongoose');
const Position = require('../models/position');
const positionEmitter = require('../util/events');
const strings = require('../util/strings');

const addPosition = async (req, res) => {
	const { projectName, clientName, technologies, role } = req.body;
	const position = new Position({
		_id: new mongoose.Types.ObjectId(),
		projectName,
		clientName,
		technologies,
		role,
		status: true,
		creator: req.user.userId
	})
	const result = await position.save();
	res.status(200);
	res.json({
		message: strings.success,
		result
	});
};

const getAllSummaries = async (req, res) => {
	const result = await Position.find({ status: true }, '_id projectName technologies role')
	res.status(200);
	res.json({
		message: strings.success,
		result
	});
};

const getPosition = async (req, res) => {
	const selectUserFields = 'userName _id name role';
	const position = await Position.find({ 
		_id: req.body.id
	}).populate('creator', selectUserFields)
		.populate('applicants', selectUserFields);
	res.status(200);
	res.json({
		message: strings.success,
		position
	});
};

const deletePosition = async (req, res) => {
	const { userId } = req.user;
	const { id }= req.params;
	const position = await Position.findById({ _id: id });
	if (!position) {
		res.status(404);
		res.json({ message: strings.not_found_position });
	} else if (position.creator?.toString() !== userId) {
		res.status(401);
		res.json({ message: strings.only_creator_able_delete_position });
	} else {
		const result = await Position.remove({ _id: id });
		res.status(200);
		res.json({
			message: strings.success,
			result
		});
	}
};

const updatePosition = async (req, res) => {
	const updatableFields = ['status', 'clientName', 'technologies', 'role', 'projectName'];
	const { id } = req.body;
	const position = await Position.findById({ _id: id });

	if (!position) {
		res.status(404);
		res.json({ message: strings.not_found_position });
	} else {
		const originalStatus = position.status;
		const entries = Object.entries(req.body);
		for (const [key, value] of entries) {
			if (updatableFields.includes(key)) {
				position[key] = value;
			}
		}
		const result = await position.save();
		if (!result.status && originalStatus) {
			// trigger close event to notify the employees who have shown an interest
			positionEmitter.emit('close', { ...result._doc });
		}
		res.status(200);
		res.json({
			message: strings.success,
			result
		});
	}
}

const applyPosition = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.body;
	if (!id) {
		res.status(400);
		res.json({ message: strings.no_position_id });
	} else if (!userId) {
		res.status(400);
		res.json({ message: strings.no_user_id });
	} else {
		const position = await Position.findById({ _id: id });
		if (!position) {
			res.status(404);
			res.json({ message: strings.not_found_position });
		} else if (!position.status) {
			res.status(400);
			res.json({ message: strings.position_closed });
		} else {
			const { applicants = [] } = position;
			if (applicants.includes(userId)) {
				res.status(400).json({ message: strings.applied_position });
			} else {
				position.applicants = [...applicants, userId];
				const result = await position.save();
				positionEmitter.emit('apply', { ...result._doc });
				res.status(200);
				res.json({ message: strings.success, result });
			}
		}
	}
};

const getAllApplicantIds = async (req, res) => {
	const positions = await Position.find({}, 'applicants');
	const set = new Set();
	positions.forEach(item => {
		item.applicants?.forEach(applicant => set.add(applicant))
	});
	res.status(200);
	res.json( { applicants: Array.from(set)});
};

module.exports = {
	addPosition,
	getAllSummaries,
	getPosition,
	deletePosition,
	applyPosition,
	updatePosition,
	getAllApplicantIds
}

