// TgGroups enlUser.js
// ENL Fi Dev / RedFoxFinn
// Mongoose Model for backend

const mongoose = require('mongoose');

const enlUserSchema = new mongoose.Schema({
  userName: {
    required: true,
    unique: true,
    type: String
  },
  userValidation: {
    required: true,
    type: String
  },
  role: {
    required: true,
    type: String
  },
  active: {
    required: true,
    type: Boolean
  }
});

const EnlUser = mongoose.model('EnlUser', enlUserSchema);

module.exports = EnlUser;