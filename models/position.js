const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PositionSchema = new Schema({
  projectName: {
    type: String,
    require: [true, 'A position must have a project name.']
  },
  clientName: {
    type: String,
    require: [true, 'A position must have a client name']
  },
  technologies: {
    type: [{
      type: String,
      required: [true, 'A position must have a technology'],
    }]
  },
  role: {
    type: String,
    required: [true, 'A position must have a role'],
    enum:{
      values: ['manager ', 'developer', 'QA'],
      message: 'A role must be one of manager, developer, QA'
    } 
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  applicants: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A position must have a creator'],
  }
})

const Position = mongoose.model('Position', PositionSchema);

module.exports = Position;