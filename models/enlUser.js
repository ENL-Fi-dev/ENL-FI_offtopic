// TgGroups enlUser.js
// ENL Fi Dev / RedFoxFinn
// Mongoose Model for backend

const mongoose = require('mongoose');

const enlUserSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String
  },
  pwHash: {
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