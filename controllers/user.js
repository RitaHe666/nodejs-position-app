const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const strings = require('../util/strings');

const addUser = async (req, res) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    userName: req.body.userName,
    name: req.body.name,
    role: req.body.role,
    password: req.body.password
  });
  const result = await user.save();
  if (result) {
    res.status(201);
    res.json({
      message: strings.success,
      user: result
    });
  } 
}

const login = async (req, res) => {
  const user = await User.findOne({ userName: req.body.userName })
  if(!user) {
    res.status(401);
    res.json({ message: strings.not_found_user });
  } else if (user.password !== req.body.password) {
    res.status(401);
    res.json({ message: strings.wrong_password });
  } else {
    const { userName, _id: userId, role } = user;
    const token = jwt.sign(
      { userName, userId, role },
      process.env.JWT_KEY,
      { expiresIn: process.env.TOKEN_EXPIRES_IN }
    );
    res.status(200);
    res.json({
      token,
      user: {
        userName,
        userId,
        role
      }
    });
  }
};

const getAll= async (req, res) => {
  const result = await User.find({}, '-password');
  res.status(200).json({
    message: strings.success,
    result
  });
}

module.exports = {
  addUser,
  login,
  getAll
}
