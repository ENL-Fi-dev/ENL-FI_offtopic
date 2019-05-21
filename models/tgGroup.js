// TgGroups tgGroup.js
// ENL Fi Dev / RedFoxFinn
// Mongoose Model for backend

const mongoose = require('mongoose');

const tgGroupSchema = new mongoose.Schema({
  name: String,
  sheriff: String,
  link: String,
  info: String,
  linkDateTime: Number,
  linkExpDateTime: Number,
  addedBy: String
});

const TgGroup = mongoose.model('TgGroup', tgGroupSchema);

module.exports = TgGroup;