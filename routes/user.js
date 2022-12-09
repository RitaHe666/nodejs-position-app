const express = require('express');
const userControl = require('../controllers/user');
const router = express.Router();

router.post('/', userControl.addUser);

router.post('/login', userControl.login);

router.get('/getAll', userControl.getAll)

module.exports = router;