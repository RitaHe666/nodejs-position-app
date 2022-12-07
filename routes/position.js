const express = require('express');
const PositionControl = require('../controllers/position');
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');
const roles = require('../util/role');

const router = express.Router();

router.get('/summaries', checkAuth, PositionControl.getAllSummaries);

router.get('/getPositionById', checkAuth, PositionControl.getPosition);

router.get('/getAllApplicantIds', checkAuth, PositionControl.getAllApplicantIds);

router.post('/', checkAuth, checkRole(roles.Admin), PositionControl.addPosition);

router.post('/update', checkAuth, checkRole(roles.Admin), PositionControl.updatePosition);

router.delete('/:id', checkAuth, checkRole(roles.Admin), PositionControl.deletePosition);

router.patch('/apply', checkAuth, PositionControl.applyPosition);

module.exports = router;