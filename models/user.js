const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: String,
  userName: {
    type: String,
    require:true,
    unique: true
  },
  password: {
    type: String,
    require:true,
  },
  role: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;