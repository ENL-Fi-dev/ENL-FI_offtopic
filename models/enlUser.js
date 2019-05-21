// TgGroups enlUser.js
// ENL Fi Dev / RedFoxFinn
// Mongoose Model for backend

const mongoose = require('mongoose');

const enlUserSchema = new mongoose.Schema({
  userName: String,
  userValidation: String
});

const EnlUser = mongoose.model('EnlUser', enlUserSchema);

module.exports = EnlUser;