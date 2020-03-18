// TgGroups tgGroup.js
// ENL Fi Dev / RedFoxFinn
// Mongoose Model for backend

const mongoose = require('mongoose');

const tgGroupSchema = new mongoose.Schema({
  name: {
    required: true,
    unique: true,
    type: String
  },
  sheriff: {
    type: [{type: String, unique: true}]
  },
  link: {
    required: true,
    type: String
  },
  info: {
    type: String
  },
  linkDateTime: {
    type: Number
  },
  linkExpDateTime: {
    type: Number
  },
  addedBy: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EnlUser'
  }
});

const TgGroup = mongoose.model('TgGroup', tgGroupSchema);

module.exports = TgGroup;